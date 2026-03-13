
import random
import uuid

especialidades = [
    "Cardiologia", "Pediatria", "Dermatologia", "Clínico Geral", "Ginecologia",
    "Oftalmologia", "Ortopedia", "Psiquiatria", "Neurologia", "Endocrinologia",
    "Nutrologia", "Urologia", "Otorrinolaringologia", "Gastroenterologia", "Reumatologia"
]

cidades = [
    ("São Paulo", "SP"), ("Rio de Janeiro", "RJ"), ("Belo Horizonte", "MG"),
    ("Curitiba", "PR"), ("Porto Alegre", "RS"), ("Recife", "PE"),
    ("Fortaleza", "CE"), ("Salvador", "BA"), ("Brasília", "DF"),
    ("Manaus", "AM"), ("Goiânia", "GO"), ("Belém", "PA"),
    ("Vitória", "ES"), ("Florianópolis", "SC"), ("Natal", "RN")
]

prefixos = ["Dr.", "Dra."]
nomes_homens = ["Gabriel", "Lucas", "Mateus", "Felipe", "Rodrigo", "Ricardo", "Paulo", "Fernando", "Thiago", "Gustavo"]
nomes_mulheres = ["Ana", "Julia", "Beatriz", "Camila", "Letícia", "Patrícia", "Renata", "Helena", "Simone", "Alice"]
sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Ferreira", "Alves", "Rodrigues", "Martins"]

planos = ["Unimed", "Amil", "Bradesco", "SulAmérica", "Porto Seguro"]

sql = "-- Inserção de 50 Médicos\n"

for i in range(1, 51):
    is_male = random.choice([True, False])
    prefixo = "Dr." if is_male else "Dra."
    nome = f"{prefixo} {random.choice(nomes_homens if is_male else nomes_mulheres)} {random.choice(sobrenomes)}"
    esp = random.choice(especialidades)
    cidade, estado = random.choice(cidades)
    crm = f"{random.randint(10000, 99999)}-{estado}"
    valor = random.randint(200, 500)
    nota = round(random.uniform(4.5, 5.0), 1)
    avaliacoes = random.randint(10, 250)
    
    # Endereço JSONB
    endereco = f'{{"cidade": "{cidade}", "estado": "{estado}", "logradouro": "Rua Exemplo {i}", "numero": "{random.randint(1, 2000)}", "bairro": "Centro", "cep": "00000-000", "latitude": 0, "longitude": 0}}'
    
    # Foto (será gerada ou placeholder)
    foto = f"/images/medicos/medico_{i}.png"
    
    # Planos aceitos (Array de texto no Supabase: ARRAY['plano1', 'plano2'])
    aceita = random.sample(planos, random.randint(1, 3))
    planos_sql = "ARRAY[" + ", ".join([f"'{p}'" for p in aceita]) + "]"

    # Seeder
    sql += f"INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)\n"
    sql += f"VALUES ('{nome}', '{crm}', (SELECT id FROM especialidades WHERE nome = '{esp}' LIMIT 1), '{foto}', 'Especialista em {esp} atuando em {cidade}.', {valor}, {nota}, {avaliacoes}, '{endereco}', {planos_sql});\n\n"

with open("c:/Users/david/OneDrive/BKP DAVID/DOCMATCH/data/medicos_seed.sql", "w", encoding="utf-8") as f:
    f.write(sql)
