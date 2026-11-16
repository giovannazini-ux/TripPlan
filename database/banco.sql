PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE IF NOT EXISTS viagens (
    id_viagem INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    destino TEXT NOT NULL,
    data_ida TEXT NOT NULL,
    data_volta TEXT NOT NULL CHECK (data_volta >= data_ida),
    orcamento REAL NOT NULL CHECK (orcamento > 0)
);

CREATE TABLE IF NOT EXISTS destinos (
    id_destino INTEGER PRIMARY KEY AUTOINCREMENT,
    id_viagem INTEGER NOT NULL REFERENCES viagens(id_viagem),
    cidade TEXT NOT NULL,
    pais TEXT NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS passeios (
    id_passeio INTEGER PRIMARY KEY AUTOINCREMENT,
    id_viagem INTEGER NOT NULL REFERENCES viagens(id_viagem),
    nome TEXT NOT NULL,
    data TEXT NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS despesas (
    id_despesa INTEGER PRIMARY KEY AUTOINCREMENT,
    id_viagem INTEGER NOT NULL REFERENCES viagens(id_viagem),
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    valor REAL NOT NULL CHECK (valor > 0)
);

CREATE INDEX IF NOT EXISTS destinos_por_viagem ON destinos(id_viagem);
CREATE INDEX IF NOT EXISTS passeios_por_viagem ON passeios(id_viagem);
CREATE INDEX IF NOT EXISTS despesas_por_viagem ON despesas(id_viagem);

COMMIT;
