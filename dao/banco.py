from contextlib import closing, contextmanager
from pathlib import Path
import sqlite3


PASTA_BANCO = Path(__file__).resolve().parents[1] / "database"
CAMINHO_BANCO = PASTA_BANCO / "tripplan.db"


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
