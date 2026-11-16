from contextlib import closing
from pathlib import Path
import shutil
import sqlite3
from tempfile import TemporaryDirectory
import unittest

from app import create_app
from dao.banco import CAMINHO_BANCO


VIAGEM = {
    "nome": "Férias",
    "destino": "Brasil",
    "data_ida": "2026-12-10",
    "data_volta": "2026-12-13",
    "orcamento": "700.00",
}


class TripPlanTest(unittest.TestCase):
    def setUp(self):
        pasta = TemporaryDirectory()
        self.addCleanup(pasta.cleanup)
        self.banco = Path(pasta.name) / "tripplan.db"
        self.client = create_app(self.banco).test_client()

    def test_paginas_e_arquivos_estaticos(self):
        for rota in ("/", "/explorar", "/viagens", "/destinos", "/passeios", "/despesas"):
            with self.subTest(rota=rota):
                resposta = self.client.get(rota)
                self.assertEqual(resposta.status_code, 200)
                self.assertIn(b'data-api="/api"', resposta.data)
                self.assertIn(b'src="/static/js/script.js"', resposta.data)
        with self.client.get("/static/css/style.css") as resposta:
            self.assertEqual(resposta.status_code, 200)
        self.assertEqual(self.client.head("/api/viagens").status_code, 200)

    def test_cria_edita_exclui_e_totaliza_despesas(self):
        resposta = self.client.post("/api/viagens", json=VIAGEM)
        self.assertEqual(resposta.status_code, 201)
        id_viagem = resposta.json["id"]
        viagem_url = f"/api/viagens/{id_viagem}"
        self.assertEqual(
            self.client.put(viagem_url, json={**VIAGEM, "nome": "Viagem editada"}).status_code, 200
        )

        registros = {
            "destinos": {"cidade": "Paraty", "pais": "Brasil", "descricao": "Centro"},
            "passeios": {"nome": "Passeio de barco", "data": "2026-12-11", "descricao": ""},
            "despesas": {"descricao": "Passagem", "categoria": "Transporte", "valor": "120.50"},
        }
        ids = {}
        for colecao, dados in registros.items():
            rota = f"/api/{colecao}"
            with self.subTest(colecao=colecao):
                resposta = self.client.post(rota, json={**dados, "id_viagem": id_viagem})
                self.assertEqual(resposta.status_code, 201)
                ids[colecao] = resposta.json["id"]
                registro_url = f"{rota}/{ids[colecao]}"
                self.assertEqual(
                    self.client.put(registro_url, json={**dados, "id_viagem": id_viagem, "descricao": "Revisado"}).status_code,
                    200,
                )
                registro = self.client.get(rota).json[0]
                self.assertEqual(registro["nome_viagem"], "Viagem editada")
                self.assertEqual(registro["descricao"], "Revisado")

        client_reaberto = create_app(self.banco).test_client()
        self.assertEqual(client_reaberto.get("/api/viagens").json[0]["total_despesas"], 120.5)
        self.assertEqual(client_reaberto.delete(viagem_url).status_code, 409)

        for colecao, id_registro in ids.items():
            self.assertEqual(client_reaberto.delete(f"/api/{colecao}/{id_registro}").status_code, 200)
            self.assertEqual(client_reaberto.get(f"/api/{colecao}").json, [])
        self.assertEqual(client_reaberto.get("/api/viagens").json[0]["total_despesas"], 0)
        self.assertEqual(client_reaberto.delete(viagem_url).status_code, 200)
        self.assertEqual(client_reaberto.delete(viagem_url).status_code, 404)

    def test_valida_entradas_e_vinculos(self):
        entradas_invalidas = [
            [],
            {**VIAGEM, "nome": "  "},
            {**VIAGEM, "data_volta": "2026-12-01"},
            {**VIAGEM, "data_ida": "2026-02-30"},
            {**VIAGEM, "orcamento": "12.345"},
            {**VIAGEM, "orcamento": "NaN"},
            {**VIAGEM, "orcamento": "-1"},
        ]
        for dados in entradas_invalidas:
            with self.subTest(dados=dados):
                self.assertEqual(self.client.post("/api/viagens", json=dados).status_code, 400)

        dados = {"id_viagem": 999, "cidade": "Lisboa", "pais": "Portugal"}
        self.assertEqual(self.client.post("/api/destinos", json=dados).status_code, 409)
        self.assertEqual(self.client.get("/api/destinos").json, [])

    def test_preserva_registros_do_banco_anterior(self):
        banco_anterior = self.banco.with_name("anterior.db")
        shutil.copyfile(CAMINHO_BANCO, banco_anterior)
        client = create_app(banco_anterior).test_client()
        with closing(sqlite3.connect(CAMINHO_BANCO)) as conexao:
            conexao.row_factory = sqlite3.Row
            for tabela in ("viagens", "destinos", "passeios", "despesas"):
                with self.subTest(tabela=tabela):
                    chave = client.get(f"/api/{tabela}").json
                    linhas = conexao.execute(f"SELECT * FROM {tabela} ORDER BY 1 DESC")
                    esperado = [dict(linha) for linha in linhas]
                    self.assertEqual(len(chave), len(esperado))
                    for novo, anterior in zip(chave, esperado):
                        self.assertEqual({campo: novo[campo] for campo in anterior}, anterior)
