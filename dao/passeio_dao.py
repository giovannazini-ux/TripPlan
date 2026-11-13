
import sqlite3
import os

CAMINHO_BANCO = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "database",
    "tripplan.db"
)

class PasseioDAO:
    def conectar(self):
        conexao = sqlite3.connect(CAMINHO_BANCO)
        conexao.execute("PRAGMA foreign_keys = ON")
        return conexao

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
            INSERT INTO passeios
            (id_viagem, nome, data, descricao)
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
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT passeios.id_passeio, passeios.nome,
                   passeios.data, passeios.descricao,
                   passeios.id_viagem, viagens.nome
            FROM passeios
            INNER JOIN viagens
            ON passeios.id_viagem = viagens.id_viagem
        """)

        passeios = cursor.fetchall()
        conexao.close()

        return passeios
