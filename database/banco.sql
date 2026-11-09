CREATE TABLE IF NOT EXISTS viagens (
    id_viagens INT NOT NULL AUTO_INCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    PRIMARY KEY (id_viagens)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS destinos (
    id_destinos INT NOT NULL AUTO_INCREMENT,
    id_viagens INT NOT NULL,
    nome TEXT NOT NULL,
    pais TEXT,
    cidade TEXT,
    PRIMARY KEY (id_destinos),
    FOREIGN KEY (id_viagens) REFERENCES viagens(id_viagens)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS passeios (
    id_passeios INT NOT NULL AUTO_INCREMENT,
    id_destinos INT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    data DATE,
    PRIMARY KEY (id_passeios),
    FOREIGN KEY (id_destinos) REFERENCES destinos(id_destinos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS despesas (
    id_despesas INT NOT NULL AUTO_INCREMENT,
    id_viagens INT NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE,
    PRIMARY KEY (id_despesas),
    FOREIGN KEY (id_viagens) REFERENCES viagens(id_viagens)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
