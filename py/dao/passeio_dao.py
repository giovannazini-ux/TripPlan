from dao.registros import RegistroDAO


class PasseioDAO(RegistroDAO):
    tabela = "passeios"
    chave = "id_passeio"
    consulta = """
        SELECT passeios.*, viagens.nome AS nome_viagem
        FROM passeios
        JOIN viagens USING (id_viagem)
        ORDER BY passeios.id_passeio DESC
    """
