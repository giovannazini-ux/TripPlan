
from flask import Flask, render_template, send_from_directory, jsonify, request
from models.viagem import Viagem
from models.destino import Destino
from models.passeio import Passeio
from models.despesa import Despesa
from dao.viagem_dao import ViagemDAO
from dao.destino_dao import DestinoDAO
from dao.passeio_dao import PasseioDAO
from dao.despesa_dao import DespesaDAO

app = Flask(__name__, template_folder="pages", static_folder=None)

viagem_dao = ViagemDAO()
destino_dao = DestinoDAO()
passeio_dao = PasseioDAO()
despesa_dao = DespesaDAO()

viagem_dao.criar_tabela()
destino_dao.criar_tabela()
passeio_dao.criar_tabela()
despesa_dao.criar_tabela()


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/explorar")
def explorar():
    return render_template("explorar.html")


@app.route("/viagens")
def viagens():
    return render_template("viagens.html")


@app.route("/destinos")
def destinos():
    return render_template("destinos.html")


@app.route("/passeios")
def passeios():
    return render_template("passeios.html")


@app.route("/despesas")
def despesas():
    return render_template("despesas.html")


@app.route("/style/<path:filename>")
def style(filename):
    return send_from_directory("style", filename)


@app.route("/script/<path:filename>")
def script(filename):
    return send_from_directory("script", filename)


@app.route("/api/viagens", methods=["GET", "POST"])
def api_viagens():
    if request.method == "GET":
        return jsonify(viagem_dao.listar())

    dados = request.get_json()

    try:
        viagem = Viagem(
            dados["nome"],
            dados["destino"],
            dados["data_ida"],
            dados["data_volta"],
            float(dados["orcamento"])
        )

        viagem_dao.cadastrar(viagem)
        return jsonify({"mensagem": "Viagem cadastrada!"}), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": "Verifique os dados da viagem."}), 400


@app.route("/api/destinos", methods=["GET", "POST"])
def api_destinos():
    if request.method == "GET":
        return jsonify(destino_dao.listar())

    dados = request.get_json()

    try:
        destino = Destino(
            dados["cidade"],
            dados["pais"],
            int(dados["id_viagem"]),
            dados.get("descricao", "")
        )

        destino_dao.cadastrar(destino)
        return jsonify({"mensagem": "Destino cadastrado!"}), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": "Verifique os dados do destino."}), 400


@app.route("/api/passeios", methods=["GET", "POST"])
def api_passeios():
    if request.method == "GET":
        return jsonify(passeio_dao.listar())

    dados = request.get_json()

    try:
        passeio = Passeio(
            dados["nome"],
            dados["data"],
            int(dados["id_viagem"]),
            dados.get("descricao", "")
        )

        passeio_dao.cadastrar(passeio)
        return jsonify({"mensagem": "Passeio cadastrado!"}), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": "Verifique os dados do passeio."}), 400


@app.route("/api/despesas", methods=["GET", "POST"])
def api_despesas():
    if request.method == "GET":
        return jsonify(despesa_dao.listar())

    dados = request.get_json()

    try:
        despesa = Despesa(
            dados["descricao"],
            dados["categoria"],
            float(dados["valor"]),
            int(dados["id_viagem"])
        )

        if despesa.valor <= 0:
            return jsonify({"erro": "O valor deve ser maior que zero."}), 400

        despesa_dao.cadastrar(despesa)
        return jsonify({"mensagem": "Despesa cadastrada!"}), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": "Verifique os dados da despesa."}), 400


if __name__ == "__main__":
    app.run(debug=True)
