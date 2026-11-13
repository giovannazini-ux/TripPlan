
from flask import Flask, render_template, send_from_directory, jsonify, request
from models.viagem import Viagem
from dao.viagem_dao import ViagemDAO
from models.destino import Destino
from dao.destino_dao import DestinoDAO
from models.passeio import Passeio
from dao.passeio_dao import PasseioDAO
from models.despesa import Despesa
from dao.despesa_dao import DespesaDAO

app = Flask(__name__, template_folder="pages", static_folder=None)

viagem_dao = ViagemDAO()
viagem_dao.criar_tabela()

destino_dao = DestinoDAO()
destino_dao.criar_tabela()

passeio_dao = PasseioDAO()
passeio_dao.criar_tabela()

despesa_dao = DespesaDAO()
despesa_dao.criar_tabela()

@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/viagens")
def viagens():
    return render_template("viagens.html")


@app.route("/destinos")
def destinos():
    return render_template("destinos.html")

@app.route("/explorar")
def explorar():
    return render_template("explorar.html")    


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


@app.route("/api/viagens", methods=["GET"])
def listar_viagens():
    viagens = viagem_dao.listar()

    resultado = []

    for viagem in viagens:
        resultado.append({
            "id_viagem": viagem[0],
            "nome": viagem[1],
            "destino": viagem[2],
            "data_ida": viagem[3],
            "data_volta": viagem[4],
            "orcamento": viagem[5]
        })

    return jsonify(resultado)


@app.route("/api/viagens", methods=["POST"])
def cadastrar_viagem():
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

        return jsonify({"mensagem": "Viagem cadastrada com sucesso!"}), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({"erro": "Dados da viagem inválidos."}), 400


@app.route("/api/destinos", methods=["GET"])
def listar_destinos():
    destinos = destino_dao.listar()

    return jsonify([
        {
            "id_destino": d[0],
            "cidade": d[1],
            "pais": d[2],
            "descricao": d[3],
            "id_viagem": d[4],
            "nome_viagem": d[5]
        }
        for d in destinos
    ])


@app.route("/api/destinos", methods=["POST"])
def cadastrar_destino():
    dados = request.get_json()

    try:
        destino = Destino(
            dados["cidade"],
            dados["pais"],
            int(dados["id_viagem"]),
            dados.get("descricao", "")
        )

        destino_dao.cadastrar(destino)

        return jsonify({"mensagem": "Destino cadastrado com sucesso!"}), 201

    except (KeyError, TypeError, ValueError) as erro:
        return jsonify({"erro": str(erro)}), 400

    except Exception as erro:
        return jsonify({"erro": str(erro)}), 400


@app.route("/api/passeios", methods=["GET"])
def listar_passeios():
    passeios = passeio_dao.listar()

    return jsonify([
        {
            "id_passeio": p[0],
            "nome": p[1],
            "data": p[2],
            "descricao": p[3],
            "id_viagem": p[4],
            "nome_viagem": p[5]
        }
        for p in passeios
    ])


@app.route("/api/passeios", methods=["POST"])
def cadastrar_passeio():
    dados = request.get_json()

    try:
        passeio = Passeio(
            dados["nome"],
            dados["data"],
            int(dados["id_viagem"]),
            dados.get("descricao", "")
        )

        passeio_dao.cadastrar(passeio)

        return jsonify({"mensagem": "Passeio cadastrado com sucesso!"}), 201

    except (KeyError, TypeError, ValueError) as erro:
        return jsonify({"erro": str(erro)}), 400

    except Exception as erro:
        return jsonify({"erro": str(erro)}), 400



@app.route("/api/despesas", methods=["GET"])
def listar_despesas():
    despesas = despesa_dao.listar()

    return jsonify([
        {
            "id_despesa": d[0],
            "descricao": d[1],
            "categoria": d[2],
            "valor": d[3],
            "id_viagem": d[4],
            "nome_viagem": d[5]
        }
        for d in despesas
    ])


@app.route("/api/despesas", methods=["POST"])
def cadastrar_despesa():
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

        return jsonify({"mensagem": "Despesa cadastrada com sucesso!"}), 201

    except (KeyError, TypeError, ValueError) as erro:
        return jsonify({"erro": str(erro)}), 400

    except Exception as erro:
        return jsonify({"erro": str(erro)}), 400


if __name__ == "__main__":
    app.run(debug=True)
