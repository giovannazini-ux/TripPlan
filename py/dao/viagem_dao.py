from dao.registros import RegistroDAO


class ViagemDAO(RegistroDAO):
    tabela = "viagens"
    chave = "id_viagem"
    consulta = """
        SELECT viagens.*, ROUND(COALESCE(SUM(despesas.valor), 0), 2) AS total_despesas
        FROM viagens
        LEFT JOIN despesas USING (id_viagem)
        GROUP BY viagens.id_viagem
        ORDER BY viagens.id_viagem DESC
    """
