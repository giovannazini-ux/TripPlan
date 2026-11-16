
import sqlite3

class DespesaDAO:
    def __init__(self):
        self.caminho = "database/tripplan.db"

    def conectar(self):
        return sqlite3.connect(self.caminho)

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
            INSERT INTO despesas (id_viagem, descricao, categoria, valor)
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
        conexao.row_factory = sqlite3.Row
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT despesas.*, viagens.nome AS nome_viagem
            FROM despesas
            INNER JOIN viagens
            ON despesas.id_viagem = viagens.id_viagem
            ORDER BY despesas.id_despesa DESC
        """)

        despesas = [dict(linha) for linha in cursor.fetchall()]
        conexao.close()
        return despesas
