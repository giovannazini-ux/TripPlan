
class Passeio:
    def __init__(self, nome, data, id_viagem, descricao, id_passeio=None):
        self.id_passeio = id_passeio
        self.nome = nome
        self.data = data
        self.id_viagem = id_viagem
        self.descricao = descricao
