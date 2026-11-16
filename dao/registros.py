from dataclasses import asdict

from dao.banco import CAMINHO_BANCO, conectar, inserir_registro


class RegistroDAO:
    def __init__(self, caminho=CAMINHO_BANCO):
        self.caminho = caminho

    def listar(self):
        with conectar(self.caminho) as conexao:
            return [dict(linha) for linha in conexao.execute(self.consulta)]

    def cadastrar(self, registro):
        with conectar(self.caminho) as conexao:
            return inserir_registro(conexao, self.tabela, asdict(registro))

    def editar(self, id_registro, registro):
        dados = asdict(registro)
        campos = ", ".join(f"{coluna} = ?" for coluna in dados)
        comando = f"UPDATE {self.tabela} SET {campos} WHERE {self.chave} = ?"
        with conectar(self.caminho) as conexao:
            return conexao.execute(comando, (*dados.values(), id_registro)).rowcount > 0

    def excluir(self, id_registro):
        comando = f"DELETE FROM {self.tabela} WHERE {self.chave} = ?"
        with conectar(self.caminho) as conexao:
            return conexao.execute(comando, (id_registro,)).rowcount > 0
