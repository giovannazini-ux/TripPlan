from contextlib import closing, contextmanager
import json
from pathlib import Path
import sqlite3


PASTA_BANCO = Path(__file__).resolve().parents[1] / "database"
CAMINHO_BANCO = PASTA_BANCO / "tripplan.db"
CAMINHO_DEMO = PASTA_BANCO / "tripplan-demo.db"
DADOS_DEMO = PASTA_BANCO / "demonstracao.json"


@contextmanager
def conectar(caminho):
    with closing(sqlite3.connect(caminho)) as conexao:
        conexao.row_factory = sqlite3.Row
        conexao.execute("PRAGMA foreign_keys = ON")
        with conexao:
            yield conexao


def preparar_banco(caminho):
    caminho = Path(caminho)
    caminho.parent.mkdir(parents=True, exist_ok=True)
    esquema = (PASTA_BANCO / "banco.sql").read_text(encoding="utf-8")
    with conectar(caminho) as conexao:
        conexao.executescript(esquema)


def inserir_registro(conexao, tabela, dados):
    colunas = ", ".join(dados)
    parametros = ", ".join("?" for _ in dados)
    comando = f"INSERT INTO {tabela} ({colunas}) VALUES ({parametros})"
    return conexao.execute(comando, tuple(dados.values())).lastrowid


def popular_demonstracao(caminho):
    with conectar(caminho) as conexao:
        conexao.execute("BEGIN IMMEDIATE")
        # A marca fica no banco para preservar as alterações feitas na demonstração.
        if conexao.execute("PRAGMA user_version").fetchone()[0] != 0:
            return
        dados = json.loads(DADOS_DEMO.read_text(encoding="utf-8"))
        for tabela in ("viagens", "destinos", "passeios", "despesas"):
            for registro in dados[tabela]:
                inserir_registro(conexao, tabela, registro)
        conexao.execute("PRAGMA user_version = 1")
