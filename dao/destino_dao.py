
import sqlite3

class DestinoDAO:
    def __init__(self):
        self.caminho = "database/tripplan.db"

    def conectar(self):
        return sqlite3.connect(self.caminho)

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
            INSERT INTO destinos (id_viagem, cidade, pais, descricao)
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
        conexao.row_factory = sqlite3.Row
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT destinos.*, viagens.nome AS nome_viagem
            FROM destinos
            INNER JOIN viagens
            ON destinos.id_viagem = viagens.id_viagem
            ORDER BY destinos.id_destino DESC
        """)

        destinos = [dict(linha) for linha in cursor.fetchall()]
        conexao.close()
        return destinos
