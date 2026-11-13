
import sqlite3
import os

CAMINHO_BANCO = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "database",
    "tripplan.db"
)

class DestinoDAO:
    def conectar(self):
        conexao = sqlite3.connect(CAMINHO_BANCO)
        conexao.execute("PRAGMA foreign_keys = ON")
        return conexao

    def criar_tabela(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS destinos (
                id_destino INTEGER PRIMARY KEY AUTOINCREMENT,
                id_viagem INTEGER NOT NULL,
                cidade TEXT NOT NULL,
                pais TEXT NOT NULL,
                descricao TEXT,
                FOREIGN KEY (id_viagem) REFERENCES viagens(id_viagem)
            )
        """)

        conexao.commit()
        conexao.close()

    def cadastrar(self, destino):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            INSERT INTO destinos
            (id_viagem, cidade, pais, descricao)
            VALUES (?, ?, ?, ?)
        """, (
            destino.id_viagem,
            destino.cidade,
            destino.pais,
            destino.descricao
        ))

        conexao.commit()
        conexao.close()

    def listar(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT destinos.id_destino, destinos.cidade,
                   destinos.pais, destinos.descricao,
                   destinos.id_viagem, viagens.nome
            FROM destinos
            INNER JOIN viagens
            ON destinos.id_viagem = viagens.id_viagem
        """)

        destinos = cursor.fetchall()
        conexao.close()

        return destinos
