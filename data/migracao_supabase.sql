-- Migração: Dados Iniciais DocMatch
-- Especialidades
INSERT INTO especialidades (nome, icone) VALUES
('Ginecologia', 'Activity'),
('Oftalmologia', 'Eye'),
('Ortopedia', 'Activity'),
('Psiquiatria', 'Brain'),
('Neurologia', 'Activity'),
('Endocrinologia', 'Thermometer'),
('Nutrologia', 'Apple'),
('Urologia', 'Activity'),
('Otorrinolaringologia', 'Headphones'),
('Gastroenterologia', 'Activity'),
('Reumatologia', 'Activity'),
('Infectologia', 'Shield'),
('Alergologia', 'Wind'),
('Angiologia', 'Activity'),
('Oncologia', 'Target')
ON CONFLICT DO NOTHING;

-- Médicos (Exemplo de Seed - será expandido para 50)
-- Sophie (Paciente)
-- Nota: Sophie precisa estar associada a um usuário do Auth se a FK for obrigatória.
-- Como é para teste, tentaremos inserir diretamente se as regras permitirem ou usaremos o cadastro manual.
INSERT INTO pacientes (id, nome, email, telefone, data_nascimento, foto)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sophie', 'sophie@email.com', '(21) 99999-0000', '2008-05-15', '/avatar-sophie.png')
ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome, foto = EXCLUDED.foto;
