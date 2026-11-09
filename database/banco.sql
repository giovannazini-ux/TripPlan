CREATE TABLE IF NOT EXISTS viagens (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS destinos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT NOT NULL,
    nome TEXT NOT NULL,
    pais TEXT,
    cidade TEXT,
    FOREIGN KEY (viagem_id) REFERENCES viagens(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS passeios (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    destino_id INT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    data DATE,
    FOREIGN KEY (destino_id) REFERENCES destinos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS despesas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE,
    FOREIGN KEY (viagem_id) REFERENCES viagens(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
