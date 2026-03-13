-- Inserção de 50 Médicos

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Helena Santos', '34509-PE', (SELECT id FROM especialidades WHERE nome = 'Ortopedia' LIMIT 1), '/images/medicos/medico_1.png', 'Especialista em Ortopedia atuando em Recife.', 206, 4.6, 246, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 1","numero":"825","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed', 'SulAmérica']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Lucas Ferreira', '80899-PE', (SELECT id FROM especialidades WHERE nome = 'Neurologia' LIMIT 1), '/images/medicos/medico_2.png', 'Especialista em Neurologia atuando em Recife.', 245, 4.8, 235, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 2","numero":"784","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Bradesco', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Silva', '99511-GO', (SELECT id FROM especialidades WHERE nome = 'Dermatologia' LIMIT 1), '/images/medicos/medico_3.png', 'Especialista em Dermatologia atuando em Goiânia.', 423, 4.7, 10, '{"cidade":"Goiânia","estado":"GO","logradouro":"Rua Exemplo 3","numero":"414","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Ricardo Ferreira', '51665-CE', (SELECT id FROM especialidades WHERE nome = 'Psiquiatria' LIMIT 1), '/images/medicos/medico_4.png', 'Especialista em Psiquiatria atuando em Fortaleza.', 224, 4.9, 125, '{"cidade":"Fortaleza","estado":"CE","logradouro":"Rua Exemplo 4","numero":"161","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Lucas Costa', '12597-CE', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_5.png', 'Especialista em Gastroenterologia atuando em Fortaleza.', 221, 5.0, 186, '{"cidade":"Fortaleza","estado":"CE","logradouro":"Rua Exemplo 5","numero":"1383","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Gustavo Oliveira', '29391-AM', (SELECT id FROM especialidades WHERE nome = 'Endocrinologia' LIMIT 1), '/images/medicos/medico_6.png', 'Especialista em Endocrinologia atuando em Manaus.', 363, 4.7, 213, '{"cidade":"Manaus","estado":"AM","logradouro":"Rua Exemplo 6","numero":"740","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Alves', '90679-ES', (SELECT id FROM especialidades WHERE nome = 'Endocrinologia' LIMIT 1), '/images/medicos/medico_7.png', 'Especialista em Endocrinologia atuando em Vitória.', 213, 4.6, 55, '{"cidade":"Vitória","estado":"ES","logradouro":"Rua Exemplo 7","numero":"1325","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Bradesco', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Helena Martins', '53592-PE', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_8.png', 'Especialista em Gastroenterologia atuando em Recife.', 485, 5.0, 30, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 8","numero":"1847","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Bradesco', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Mateus Ferreira', '25451-MG', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_9.png', 'Especialista em Gastroenterologia atuando em Belo Horizonte.', 324, 4.6, 230, '{"cidade":"Belo Horizonte","estado":"MG","logradouro":"Rua Exemplo 9","numero":"110","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'Unimed', 'SulAmérica']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Thiago Pereira', '71752-RN', (SELECT id FROM especialidades WHERE nome = 'Oftalmologia' LIMIT 1), '/images/medicos/medico_10.png', 'Especialista em Oftalmologia atuando em Natal.', 450, 5.0, 240, '{"cidade":"Natal","estado":"RN","logradouro":"Rua Exemplo 10","numero":"776","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Unimed', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Thiago Souza', '27674-RS', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_11.png', 'Especialista em Gastroenterologia atuando em Porto Alegre.', 229, 4.8, 52, '{"cidade":"Porto Alegre","estado":"RS","logradouro":"Rua Exemplo 11","numero":"140","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Fernando Oliveira', '38346-RN', (SELECT id FROM especialidades WHERE nome = 'Neurologia' LIMIT 1), '/images/medicos/medico_12.png', 'Especialista em Neurologia atuando em Natal.', 445, 4.9, 13, '{"cidade":"Natal","estado":"RN","logradouro":"Rua Exemplo 12","numero":"15","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Fernando Rodrigues', '32059-DF', (SELECT id FROM especialidades WHERE nome = 'Cardiologia' LIMIT 1), '/images/medicos/medico_13.png', 'Especialista em Cardiologia atuando em Brasília.', 358, 4.5, 90, '{"cidade":"Brasília","estado":"DF","logradouro":"Rua Exemplo 13","numero":"1899","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Helena Ferreira', '33296-RS', (SELECT id FROM especialidades WHERE nome = 'Psiquiatria' LIMIT 1), '/images/medicos/medico_14.png', 'Especialista em Psiquiatria atuando em Porto Alegre.', 230, 4.7, 70, '{"cidade":"Porto Alegre","estado":"RS","logradouro":"Rua Exemplo 14","numero":"1712","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'SulAmérica', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Gabriel Ferreira', '93681-SC', (SELECT id FROM especialidades WHERE nome = 'Endocrinologia' LIMIT 1), '/images/medicos/medico_15.png', 'Especialista em Endocrinologia atuando em Florianópolis.', 437, 4.9, 120, '{"cidade":"Florianópolis","estado":"SC","logradouro":"Rua Exemplo 15","numero":"193","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Bradesco', 'SulAmérica']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Helena Santos', '20541-PA', (SELECT id FROM especialidades WHERE nome = 'Oftalmologia' LIMIT 1), '/images/medicos/medico_16.png', 'Especialista em Oftalmologia atuando em Belém.', 383, 5.0, 96, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 16","numero":"1526","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil', 'Porto Seguro', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Letícia Souza', '72633-RS', (SELECT id FROM especialidades WHERE nome = 'Endocrinologia' LIMIT 1), '/images/medicos/medico_17.png', 'Especialista em Endocrinologia atuando em Porto Alegre.', 310, 4.7, 70, '{"cidade":"Porto Alegre","estado":"RS","logradouro":"Rua Exemplo 17","numero":"1530","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Amil', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Ana Souza', '85538-DF', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_18.png', 'Especialista em Nutrologia atuando em Brasília.', 402, 4.9, 157, '{"cidade":"Brasília","estado":"DF","logradouro":"Rua Exemplo 18","numero":"296","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Fernando Silva', '18148-BA', (SELECT id FROM especialidades WHERE nome = 'Pediatria' LIMIT 1), '/images/medicos/medico_19.png', 'Especialista em Pediatria atuando em Salvador.', 201, 4.9, 180, '{"cidade":"Salvador","estado":"BA","logradouro":"Rua Exemplo 19","numero":"927","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Rodrigo Pereira', '94340-PR', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_20.png', 'Especialista em Otorrinolaringologia atuando em Curitiba.', 350, 5.0, 68, '{"cidade":"Curitiba","estado":"PR","logradouro":"Rua Exemplo 20","numero":"1477","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Beatriz Martins', '10456-AM', (SELECT id FROM especialidades WHERE nome = 'Neurologia' LIMIT 1), '/images/medicos/medico_21.png', 'Especialista em Neurologia atuando em Manaus.', 437, 4.8, 22, '{"cidade":"Manaus","estado":"AM","logradouro":"Rua Exemplo 21","numero":"1859","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Mateus Martins', '53421-SC', (SELECT id FROM especialidades WHERE nome = 'Dermatologia' LIMIT 1), '/images/medicos/medico_22.png', 'Especialista em Dermatologia atuando em Florianópolis.', 452, 4.8, 198, '{"cidade":"Florianópolis","estado":"SC","logradouro":"Rua Exemplo 22","numero":"980","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Rodrigo Martins', '36684-SC', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_23.png', 'Especialista em Otorrinolaringologia atuando em Florianópolis.', 411, 4.6, 240, '{"cidade":"Florianópolis","estado":"SC","logradouro":"Rua Exemplo 23","numero":"1259","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Beatriz Santos', '74644-PA', (SELECT id FROM especialidades WHERE nome = 'Neurologia' LIMIT 1), '/images/medicos/medico_24.png', 'Especialista em Neurologia atuando em Belém.', 388, 4.5, 64, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 24","numero":"1560","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Beatriz Pereira', '78292-RJ', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_25.png', 'Especialista em Gastroenterologia atuando em Rio de Janeiro.', 227, 5.0, 100, '{"cidade":"Rio de Janeiro","estado":"RJ","logradouro":"Rua Exemplo 25","numero":"44","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Mateus Rodrigues', '15581-DF', (SELECT id FROM especialidades WHERE nome = 'Cardiologia' LIMIT 1), '/images/medicos/medico_26.png', 'Especialista em Cardiologia atuando em Brasília.', 494, 4.8, 194, '{"cidade":"Brasília","estado":"DF","logradouro":"Rua Exemplo 26","numero":"125","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Thiago Santos', '87178-MG', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_27.png', 'Especialista em Gastroenterologia atuando em Belo Horizonte.', 311, 5.0, 247, '{"cidade":"Belo Horizonte","estado":"MG","logradouro":"Rua Exemplo 27","numero":"726","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Souza', '30851-MG', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_28.png', 'Especialista em Nutrologia atuando em Belo Horizonte.', 414, 4.7, 198, '{"cidade":"Belo Horizonte","estado":"MG","logradouro":"Rua Exemplo 28","numero":"962","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Fernando Oliveira', '65745-PA', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_29.png', 'Especialista em Nutrologia atuando em Belém.', 289, 4.8, 46, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 29","numero":"531","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Mateus Pereira', '76391-PA', (SELECT id FROM especialidades WHERE nome = 'Pediatria' LIMIT 1), '/images/medicos/medico_30.png', 'Especialista em Pediatria atuando em Belém.', 419, 5.0, 161, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 30","numero":"903","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Ferreira', '41111-ES', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_31.png', 'Especialista em Otorrinolaringologia atuando em Vitória.', 339, 4.9, 84, '{"cidade":"Vitória","estado":"ES","logradouro":"Rua Exemplo 31","numero":"1109","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Helena Costa', '63253-AM', (SELECT id FROM especialidades WHERE nome = 'Dermatologia' LIMIT 1), '/images/medicos/medico_32.png', 'Especialista em Dermatologia atuando em Manaus.', 388, 4.8, 125, '{"cidade":"Manaus","estado":"AM","logradouro":"Rua Exemplo 32","numero":"1434","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Porto Seguro', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Lucas Souza', '41527-RN', (SELECT id FROM especialidades WHERE nome = 'Dermatologia' LIMIT 1), '/images/medicos/medico_33.png', 'Especialista em Dermatologia atuando em Natal.', 211, 4.5, 53, '{"cidade":"Natal","estado":"RN","logradouro":"Rua Exemplo 33","numero":"266","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed', 'Amil', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Camila Pereira', '99044-CE', (SELECT id FROM especialidades WHERE nome = 'Pediatria' LIMIT 1), '/images/medicos/medico_34.png', 'Especialista em Pediatria atuando em Fortaleza.', 311, 4.6, 172, '{"cidade":"Fortaleza","estado":"CE","logradouro":"Rua Exemplo 34","numero":"1961","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Bradesco']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Mateus Costa', '31375-CE', (SELECT id FROM especialidades WHERE nome = 'Urologia' LIMIT 1), '/images/medicos/medico_35.png', 'Especialista em Urologia atuando em Fortaleza.', 213, 5.0, 236, '{"cidade":"Fortaleza","estado":"CE","logradouro":"Rua Exemplo 35","numero":"879","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Porto Seguro', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Rodrigo Rodrigues', '21654-PE', (SELECT id FROM especialidades WHERE nome = 'Pediatria' LIMIT 1), '/images/medicos/medico_36.png', 'Especialista em Pediatria atuando em Recife.', 427, 4.7, 248, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 36","numero":"171","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Gustavo Alves', '81543-AM', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_37.png', 'Especialista em Nutrologia atuando em Manaus.', 288, 4.5, 125, '{"cidade":"Manaus","estado":"AM","logradouro":"Rua Exemplo 37","numero":"12","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'Porto Seguro', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Julia Alves', '64563-RS', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_38.png', 'Especialista em Nutrologia atuando em Porto Alegre.', 458, 4.9, 150, '{"cidade":"Porto Alegre","estado":"RS","logradouro":"Rua Exemplo 38","numero":"631","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Amil', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Ana Silva', '17048-GO', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_39.png', 'Especialista em Otorrinolaringologia atuando em Goiânia.', 413, 4.7, 71, '{"cidade":"Goiânia","estado":"GO","logradouro":"Rua Exemplo 39","numero":"142","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Julia Oliveira', '93265-BA', (SELECT id FROM especialidades WHERE nome = 'Ortopedia' LIMIT 1), '/images/medicos/medico_40.png', 'Especialista em Ortopedia atuando em Salvador.', 227, 4.9, 119, '{"cidade":"Salvador","estado":"BA","logradouro":"Rua Exemplo 40","numero":"1243","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Ana Alves', '58595-DF', (SELECT id FROM especialidades WHERE nome = 'Endocrinologia' LIMIT 1), '/images/medicos/medico_41.png', 'Especialista em Endocrinologia atuando em Brasília.', 242, 4.7, 197, '{"cidade":"Brasília","estado":"DF","logradouro":"Rua Exemplo 41","numero":"1676","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Felipe Souza', '46601-PE', (SELECT id FROM especialidades WHERE nome = 'Oftalmologia' LIMIT 1), '/images/medicos/medico_42.png', 'Especialista em Oftalmologia atuando em Recife.', 390, 5.0, 116, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 42","numero":"1235","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Felipe Silva', '14855-RS', (SELECT id FROM especialidades WHERE nome = 'Ginecologia' LIMIT 1), '/images/medicos/medico_43.png', 'Especialista em Ginecologia atuando em Porto Alegre.', 304, 4.9, 230, '{"cidade":"Porto Alegre","estado":"RS","logradouro":"Rua Exemplo 43","numero":"749","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil', 'Unimed']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Fernando Costa', '75149-PE', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_44.png', 'Especialista em Otorrinolaringologia atuando em Recife.', 469, 4.8, 19, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 44","numero":"1819","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Camila Rodrigues', '43939-MG', (SELECT id FROM especialidades WHERE nome = 'Otorrinolaringologia' LIMIT 1), '/images/medicos/medico_45.png', 'Especialista em Otorrinolaringologia atuando em Belo Horizonte.', 249, 4.7, 31, '{"cidade":"Belo Horizonte","estado":"MG","logradouro":"Rua Exemplo 45","numero":"552","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['SulAmérica', 'Unimed', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Beatriz Silva', '93676-BA', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_46.png', 'Especialista em Gastroenterologia atuando em Salvador.', 238, 4.6, 96, '{"cidade":"Salvador","estado":"BA","logradouro":"Rua Exemplo 46","numero":"1473","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'Amil', 'Porto Seguro']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Costa', '50663-PA', (SELECT id FROM especialidades WHERE nome = 'Gastroenterologia' LIMIT 1), '/images/medicos/medico_47.png', 'Especialista em Gastroenterologia atuando em Belém.', 312, 4.6, 147, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 47","numero":"1952","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Porto Seguro', 'Amil', 'SulAmérica']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Paulo Silva', '70280-PA', (SELECT id FROM especialidades WHERE nome = 'Pediatria' LIMIT 1), '/images/medicos/medico_48.png', 'Especialista em Pediatria atuando em Belém.', 381, 4.7, 129, '{"cidade":"Belém","estado":"PA","logradouro":"Rua Exemplo 48","numero":"463","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dra. Renata Santos', '79052-AM', (SELECT id FROM especialidades WHERE nome = 'Psiquiatria' LIMIT 1), '/images/medicos/medico_49.png', 'Especialista em Psiquiatria atuando em Manaus.', 263, 4.8, 114, '{"cidade":"Manaus","estado":"AM","logradouro":"Rua Exemplo 49","numero":"693","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Unimed', 'Amil']);

INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)
VALUES ('Dr. Lucas Pereira', '72798-PE', (SELECT id FROM especialidades WHERE nome = 'Nutrologia' LIMIT 1), '/images/medicos/medico_50.png', 'Especialista em Nutrologia atuando em Recife.', 345, 4.6, 115, '{"cidade":"Recife","estado":"PE","logradouro":"Rua Exemplo 50","numero":"737","bairro":"Centro","cep":"00000-000","latitude":0,"longitude":0}', ARRAY['Bradesco', 'SulAmérica', 'Porto Seguro']);

