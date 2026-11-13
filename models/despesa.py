
class Despesa:
    def __init__(self, descricao, categoria, valor, id_viagem, id_despesa=None):
        self.id_despesa = id_despesa
        self.descricao = descricao
        self.categoria = categoria
        self.valor = valor
        self.id_viagem = id_viagem
