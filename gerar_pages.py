from pathlib import Path
import shutil

from flask import Flask

from app import PAGINAS, renderizar_pagina
from dao.banco import DADOS_DEMO


RAIZ = Path(__file__).resolve().parent


def gerar_pages(saida=RAIZ / "_site"):
    saida.mkdir(parents=True, exist_ok=True)
    app = Flask(__name__)
    with app.app_context():
        for pagina, (arquivo, _) in PAGINAS.items():
            (saida / arquivo).write_text(renderizar_pagina(pagina, online=True), encoding="utf-8")

    shutil.copytree(RAIZ / "static", saida / "static", dirs_exist_ok=True)
    pasta_dados = saida / "dados"
    pasta_dados.mkdir(exist_ok=True)
    shutil.copyfile(DADOS_DEMO, pasta_dados / DADOS_DEMO.name)


if __name__ == "__main__":
    gerar_pages()
