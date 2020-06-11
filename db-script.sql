
CREATE DATABASE score_match_league;

USE score_match_league;

CREATE TABLE tb_status (
    id INT AUTO_INCREMENT NOT NULL,
    description VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO tb_status (description) VALUES ('ATIVO'), ('ENCERRADO'), ('BANIDO'), ('PENDENTE');

CREATE TABLE tb_player(
    id INT AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    uf CHAR(2),
    register_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status INT NOT NULL, -- FK tb_status
    PRIMARY KEY (id),
    FOREIGN KEY (status) REFERENCES tb_status(id)
);

CREATE TABLE tb_league (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(45) NOT NULL,
    status INT NOT NULL, -- FK tb_status
    register_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (status) REFERENCES tb_status(id)
);

CREATE TABLE tb_division_type (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(45) NOT NULL,
    number_max_of_players int NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO tb_division_type (name, number_max_of_players) VALUES ('A', 12), ('B', 12), ('C', 12), ('D', 12);

CREATE TABLE tb_league_division (
    id INT AUTO_INCREMENT NOT NULL,
    id_league INT NOT NULL, -- FK tb_league
    id_division_type INT NOT NULL, -- FK tb_division_type
    PRIMARY KEY (id),
    FOREIGN KEY (id_league) REFERENCES tb_league(id),
    FOREIGN KEY (id_division_type) REFERENCES tb_division_type(id)
);

CREATE TABLE tb_league_division_players (
    id INT AUTO_INCREMENT,
    id_player INT NOT NULL, -- FK tb_player
    id_league_division INT NOT NULL,-- FK tb_league_division
    PRIMARY KEY (id),
    FOREIGN KEY (id_player) REFERENCES tb_player(id),
    FOREIGN KEY (id_league_division) REFERENCES tb_league_division(id)
);

CREATE TABLE tb_league_division_matches (
    id INT AUTO_INCREMENT NOT NULL,
    id_league_division INT NOT NULL, -- FK tb_league_division
    round INT NOT NULL,
    id_league_division_player1 INT NOT NULL, -- FK tb_league_division_players
    id_league_division_player2 INT NOT NULL, -- FK tb_league_division_players
    scored_goals_player1 INT,
    scored_goals_player2 INT,
    status INT, -- FK tb_status
    last_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (id_league_division) REFERENCES tb_league_division(id),
    FOREIGN KEY (id_league_division_player1) REFERENCES tb_league_division_players(id),
    FOREIGN KEY (id_league_division_player2) REFERENCES tb_league_division_players(id),
    FOREIGN KEY (status) REFERENCES tb_status(id)
);
