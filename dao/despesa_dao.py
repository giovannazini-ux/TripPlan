from dao.registros import RegistroDAO


class DespesaDAO(RegistroDAO):
    tabela = "despesas"
    chave = "id_despesa"
    consulta = """
        SELECT despesas.*, viagens.nome AS nome_viagem
        FROM despesas
        JOIN viagens USING (id_viagem)
        ORDER BY despesas.id_despesa DESC
    """
