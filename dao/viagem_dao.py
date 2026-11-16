
import sqlite3
import os

class ViagemDAO:
    def __init__(self):
        os.makedirs("database", exist_ok=True)
        self.caminho = "database/tripplan.db"

    def conectar(self):
        return sqlite3.connect(self.caminho)

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
        conexao.row_factory = sqlite3.Row
        cursor = conexao.cursor()

        cursor.execute("SELECT * FROM viagens ORDER BY id_viagem DESC")
        viagens = [dict(linha) for linha in cursor.fetchall()]

        conexao.close()
        return viagens
