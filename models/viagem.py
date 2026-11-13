
class Viagem:
    def __init__(self, nome, destino, data_ida, data_volta, orcamento, id_viagem=None):
        self.id_viagem = id_viagem
        self.nome = nome
        self.destino = destino
        self.data_ida = data_ida
        self.data_volta = data_volta
        self.orcamento = orcamento
