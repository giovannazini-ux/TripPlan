import sqlite3

from flask import Flask, jsonify, render_template, request, url_for

from dao.banco import CAMINHO_BANCO, preparar_banco
from dao.despesa_dao import DespesaDAO
from dao.destino_dao import DestinoDAO
from dao.passeio_dao import PasseioDAO
from dao.viagem_dao import ViagemDAO
from validacao import montar_despesa, montar_destino, montar_passeio, montar_viagem


PAGINAS = {
    "inicio": ("index.html", "Início"),
    "explorar": ("explorar.html", "Explorar"),
    "viagens": ("viagens.html", "Minhas viagens"),
    "destinos": ("destinos.html", "Destinos"),
    "passeios": ("passeios.html", "Passeios"),
    "despesas": ("despesas.html", "Despesas"),
}


def renderizar_pagina(pagina, *, online=False):
    def link_pagina(destino):
        if online:
            return "./" + PAGINAS[destino][0]
        return url_for("pagina", nome=destino)

    def link_arquivo(caminho):
        if online:
            return "./static/" + caminho
        return url_for("static", filename=caminho)

    return render_template(
        PAGINAS[pagina][0],
        pagina=pagina,
        paginas=PAGINAS,
        link_pagina=link_pagina,
        link_arquivo=link_arquivo,
        online=online,
        api_url="" if online else url_for("status_api"),
    )


def create_app(caminho_banco=CAMINHO_BANCO):
    preparar_banco(caminho_banco)
    app = Flask(__name__)
    colecoes = {
        "viagens": (ViagemDAO(caminho_banco), montar_viagem),
        "destinos": (DestinoDAO(caminho_banco), montar_destino),
        "passeios": (PasseioDAO(caminho_banco), montar_passeio),
        "despesas": (DespesaDAO(caminho_banco), montar_despesa),
    }

    @app.get("/", defaults={"nome": "inicio"})
    @app.get("/<any(explorar,viagens,destinos,passeios,despesas):nome>")
    def pagina(nome):
        return renderizar_pagina(nome)

    @app.get("/api")
    def status_api():
        return jsonify(sistema="TripPlan", status="ok")

    @app.route("/api/<colecao>", methods=["GET", "POST"])
    @app.route("/api/<colecao>/<int:id_registro>", methods=["PUT", "DELETE"])
    def registros(colecao, id_registro=None):
        if colecao not in colecoes:
            return jsonify(erro="Coleção não encontrada."), 404
        dao, montar = colecoes[colecao]

        if request.method in ("GET", "HEAD"):
            return jsonify(dao.listar())
        if id_registro is not None and not 0 < id_registro <= 2**63 - 1:
            return jsonify(erro="Registro não encontrado."), 404

        try:
            if request.method == "DELETE":
                if dao.excluir(id_registro):
                    return jsonify(mensagem="Registro excluído.")
                return jsonify(erro="Registro não encontrado."), 404

            dados = request.get_json(silent=True)
            if not isinstance(dados, dict):
                return jsonify(erro="Envie os dados do formulário em JSON."), 400
            registro = montar(dados)

            if request.method == "POST":
                id_novo = dao.cadastrar(registro)
                return jsonify(id=id_novo, mensagem="Cadastro realizado."), 201
            if dao.editar(id_registro, registro):
                return jsonify(mensagem="Alterações salvas.")
            return jsonify(erro="Registro não encontrado."), 404

        except ValueError as erro:
            return jsonify(erro=str(erro)), 400
        except sqlite3.IntegrityError:
            if request.method == "DELETE" and colecao == "viagens":
                return jsonify(erro="Exclua os destinos, passeios e despesas vinculados à viagem primeiro."), 409
            return jsonify(erro="Confira os dados e selecione uma viagem cadastrada."), 409

    return app


if __name__ == "__main__":
    create_app().run()
