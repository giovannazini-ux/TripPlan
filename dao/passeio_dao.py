
import sqlite3

class PasseioDAO:
    def __init__(self):
        self.caminho = "database/tripplan.db"

    def conectar(self):
        return sqlite3.connect(self.caminho)

    def criar_tabela(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS passeios (
                id_passeio INTEGER PRIMARY KEY AUTOINCREMENT,
                id_viagem INTEGER NOT NULL,
                nome TEXT NOT NULL,
                data TEXT NOT NULL,
                descricao TEXT,
                FOREIGN KEY (id_viagem) REFERENCES viagens(id_viagem)
            )
        """)

        conexao.commit()
        conexao.close()

    def cadastrar(self, passeio):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            INSERT INTO passeios (id_viagem, nome, data, descricao)
            VALUES (?, ?, ?, ?)
        """, (
            passeio.id_viagem,
            passeio.nome,
            passeio.data,
            passeio.descricao
        ))

        conexao.commit()
        conexao.close()

    def listar(self):
        conexao = self.conectar()
        conexao.row_factory = sqlite3.Row
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT passeios.*, viagens.nome AS nome_viagem
            FROM passeios
            INNER JOIN viagens
            ON passeios.id_viagem = viagens.id_viagem
            ORDER BY passeios.id_passeio DESC
        """)

        passeios = [dict(linha) for linha in cursor.fetchall()]
        conexao.close()
        return passeios

