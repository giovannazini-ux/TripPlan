from dao.registros import RegistroDAO


class DestinoDAO(RegistroDAO):
    tabela = "destinos"
    chave = "id_destino"
    consulta = """
        SELECT destinos.*, viagens.nome AS nome_viagem
        FROM destinos
        JOIN viagens USING (id_viagem)
        ORDER BY destinos.id_destino DESC
    """
