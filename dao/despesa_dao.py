
import sqlite3
import os

CAMINHO_BANCO = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "database",
    "tripplan.db"
)

class DespesaDAO:
    def conectar(self):
        conexao = sqlite3.connect(CAMINHO_BANCO)
        conexao.execute("PRAGMA foreign_keys = ON")
        return conexao

    def criar_tabela(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS despesas (
                id_despesa INTEGER PRIMARY KEY AUTOINCREMENT,
                id_viagem INTEGER NOT NULL,
                descricao TEXT NOT NULL,
                categoria TEXT NOT NULL,
                valor REAL NOT NULL,
                FOREIGN KEY (id_viagem) REFERENCES viagens(id_viagem)
            )
        """)

        conexao.commit()
        conexao.close()

    def cadastrar(self, despesa):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            INSERT INTO despesas
            (id_viagem, descricao, categoria, valor)
            VALUES (?, ?, ?, ?)
        """, (
            despesa.id_viagem,
            despesa.descricao,
            despesa.categoria,
            despesa.valor
        ))

        conexao.commit()
        conexao.close()

    def listar(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT despesas.id_despesa, despesas.descricao,
                   despesas.categoria, despesas.valor,
                   despesas.id_viagem, viagens.nome
            FROM despesas
            INNER JOIN viagens
            ON despesas.id_viagem = viagens.id_viagem
        """)

        despesas = cursor.fetchall()
        conexao.close()

        return despesas
