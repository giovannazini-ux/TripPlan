
class Destino:
    def __init__(self, cidade, pais, id_viagem, descricao, id_destino=None):
        self.id_destino = id_destino
        self.cidade = cidade
        self.pais = pais
        self.id_viagem = id_viagem
        self.descricao = descricao
