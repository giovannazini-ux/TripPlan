
import sqlite3
import os

CAMINHO_BANCO = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "database",
    "tripplan.db"
)


class ViagemDAO:

    def conectar(self):
        conexao = sqlite3.connect(CAMINHO_BANCO)
        conexao.execute("PRAGMA foreign_keys = ON")
        return conexao

    def criar_tabela(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS viagens (
                id_viagem INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                destino TEXT NOT NULL,
                data_ida TEXT NOT NULL,
                data_volta TEXT NOT NULL,
                orcamento REAL NOT NULL
            )
        """)

        conexao.commit()
        conexao.close()

    def cadastrar(self, viagem):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            INSERT INTO viagens
            (nome, destino, data_ida, data_volta, orcamento)
            VALUES (?, ?, ?, ?, ?)
        """, (
            viagem.nome,
            viagem.destino,
            viagem.data_ida,
            viagem.data_volta,
            viagem.orcamento
        ))

        conexao.commit()
        conexao.close()

    def listar(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("SELECT * FROM viagens")
        viagens = cursor.fetchall()

        conexao.close()
        return viagens
