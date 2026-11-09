CREATE TABLE IF NOT EXISTS viagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE
);

CREATE TABLE IF NOT EXISTS destinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viagem_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    pais TEXT,
    cidade TEXT,
    FOREIGN KEY (viagem_id) REFERENCES viagens(id)
);

CREATE TABLE IF NOT EXISTS passeios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destino_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    data DATE,
    FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

CREATE TABLE IF NOT EXISTS despesas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viagem_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    data DATE,
    FOREIGN KEY (viagem_id) REFERENCES viagens(id)
);

