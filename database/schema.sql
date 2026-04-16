CREATE DATABASE IF NOT EXISTS irb_prime_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE irb_prime_care;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria_id INT NOT NULL,
    descricao TEXT,
    tempo_resultado VARCHAR(50),
    preparo TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE precos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exame_id INT NOT NULL,
    plano_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exame_id) REFERENCES exames(id),
    FOREIGN KEY (plano_id) REFERENCES planos(id),
    UNIQUE KEY unique_exame_plano (exame_id, plano_id)
);

CREATE TABLE campanhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    desconto_percentual DECIMAL(5, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('ativa', 'pausada', 'encerrada') DEFAULT 'ativa',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE campanha_exames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campanha_id INT NOT NULL,
    exame_id INT NOT NULL,
    FOREIGN KEY (campanha_id) REFERENCES campanhas(id),
    FOREIGN KEY (exame_id) REFERENCES exames(id),
    UNIQUE KEY unique_campanha_exame (campanha_id, exame_id)
);

CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150),
    plano_id INT,
    etapa_jornada ENUM('primeiro_contato', 'avaliacao', 'tratamento', 'acompanhamento', 'fidelizado') DEFAULT 'primeiro_contato',
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plano_id) REFERENCES planos(id)
);

CREATE TABLE campanha_pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campanha_id INT NOT NULL,
    paciente_id INT NOT NULL,
    inscrito_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campanha_id) REFERENCES campanhas(id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    UNIQUE KEY unique_campanha_paciente (campanha_id, paciente_id)
);

-- DADOS DE EXEMPLO
INSERT INTO categorias (nome, descricao) VALUES
('Laboratorial', 'Exames de sangue, urina e outros fluidos'),
('Imagem', 'Ultrassom, raio-x, tomografia e ressonância'),
('Cardiológico', 'Exames do coração e sistema cardiovascular'),
('Dermatologia', 'Exames e avaliações dermatológicas'),
('Endocrinologia', 'Exames hormonais e metabólicos');

INSERT INTO planos (nome, slug, descricao, icone) VALUES
('IRB Particular', 'particular', 'Atendimento particular sem plano', 'shield'),
('Prime Plus', 'prime-plus', 'Plano básico com descontos', 'star'),
('Prime Essential', 'prime-essential', 'Plano intermediário com mais benefícios', 'crown'),
('Prime Elite', 'prime-elite', 'Plano premium completo', 'diamond');

INSERT INTO exames (nome, categoria_id, descricao, tempo_resultado, preparo) VALUES
('Hemograma Completo', 1, 'Análise completa das células do sangue', '24 horas', 'Jejum de 4 horas'),
('Glicemia em Jejum', 1, 'Medição do nível de glicose no sangue', '24 horas', 'Jejum de 8 horas'),
('Colesterol Total e Frações', 1, 'Análise do colesterol LDL, HDL e VLDL', '24 horas', 'Jejum de 12 horas'),
('TSH e T4 Livre', 1, 'Avaliação da função tireoidiana', '48 horas', 'Sem preparo especial'),
('Ultrassom Abdominal', 2, 'Imagem dos órgãos abdominais', 'No ato', 'Jejum de 4 horas e bexiga cheia'),
('Eletrocardiograma', 3, 'Registro da atividade elétrica do coração', 'No ato', 'Sem preparo especial'),
('Teste Ergométrico', 3, 'Avaliação cardíaca durante exercício', '2 horas', 'Não praticar exercícios 24h antes'),
('Ecocardiograma', 3, 'Imagem do coração por ultrassom', '1 hora', 'Sem preparo especial'),
('Dermatoscopia Digital', 4, 'Análise digital de lesões de pele', '30 minutos', 'Sem preparo especial'),
('Curva Glicêmica', 1, 'Monitoramento da glicose ao longo do tempo', '4 horas', 'Jejum de 8 horas');

INSERT INTO precos (exame_id, plano_id, preco) VALUES
(1,1,85.00),(1,2,68.00),(1,3,55.00),(1,4,42.00),
(2,1,35.00),(2,2,28.00),(2,3,22.00),(2,4,18.00),
(3,1,95.00),(3,2,75.00),(3,3,60.00),(3,4,45.00),
(4,1,120.00),(4,2,95.00),(4,3,76.00),(4,4,58.00),
(5,1,200.00),(5,2,160.00),(5,3,128.00),(5,4,100.00),
(6,1,80.00),(6,2,64.00),(6,3,52.00),(6,4,40.00),
(7,1,350.00),(7,2,280.00),(7,3,224.00),(7,4,175.00),
(8,1,450.00),(8,2,360.00),(8,3,288.00),(8,4,220.00),
(9,1,250.00),(9,2,200.00),(9,3,160.00),(9,4,120.00),
(10,1,150.00),(10,2,120.00),(10,3,96.00),(10,4,75.00);

INSERT INTO campanhas (nome, descricao, desconto_percentual, data_inicio, data_fim, status) VALUES
('Check-up de Inverno', 'Pacote completo de exames laboratoriais com desconto especial na temporada de inverno', 25.00, '2026-04-01', '2026-06-30', 'ativa'),
('Campanha Coração Saudável', 'Exames cardiológicos com desconto para prevenção cardiovascular', 20.00, '2026-04-01', '2026-05-15', 'ativa'),
('Maio Roxo - Lúpus', 'Exames com desconto em alusão ao Maio Roxo', 15.00, '2026-05-01', '2026-05-31', 'ativa');

INSERT INTO campanha_exames (campanha_id, exame_id) VALUES
(1,1),(1,2),(1,3),(1,4),
(2,6),(2,7),(2,8),
(3,1),(3,3),(3,4);

INSERT INTO pacientes (nome, data_nascimento, cpf, telefone, email, plano_id, etapa_jornada) VALUES
('Maria Silva Santos', '1981-03-15', '123.456.789-00', '(11) 98765-4321', 'maria.silva@email.com', 4, 'fidelizado'),
('João Pedro Oliveira', '1994-07-22', '987.654.321-00', '(11) 91234-5678', 'joao.oliveira@email.com', 2, 'tratamento'),
('Ana Carolina Souza', '1990-11-08', '456.789.123-00', '(11) 94567-8901', 'ana.souza@email.com', 3, 'acompanhamento'),
('Carlos Eduardo Lima', '1975-05-30', '321.654.987-00', '(11) 97654-3210', 'carlos.lima@email.com', 1, 'avaliacao'),
('Fernanda Costa', '2000-01-20', '654.321.098-00', '(11) 93456-7890', 'fernanda.costa@email.com', 2, 'primeiro_contato'),
('Roberto Mendes', '1968-09-12', '789.012.345-00', '(11) 99012-3456', 'roberto.mendes@email.com', 4, 'fidelizado');

INSERT INTO campanha_pacientes (campanha_id, paciente_id) VALUES
(1,1),(1,2),(1,3),(1,4),
(2,1),(2,5),(2,6);