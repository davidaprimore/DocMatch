
const fs = require('fs');

const especialidades = [
    "Cardiologia", "Pediatria", "Dermatologia", "Clínico Geral", "Ginecologia",
    "Oftalmologia", "Ortopedia", "Psiquiatria", "Neurologia", "Endocrinologia",
    "Nutrologia", "Urologia", "Otorrinolaringologia", "Gastroenterologia", "Reumatologia"
];

const cidades = [
    ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"],
    ["Curitiba", "PR"], ["Porto Alegre", "RS"], ["Recife", "PE"],
    ["Fortaleza", "CE"], ["Salvador", "BA"], ["Brasília", "DF"],
    ["Manaus", "AM"], ["Goiânia", "GO"], ["Belém", "PA"],
    ["Vitória", "ES"], ["Florianópolis", "SC"], ["Natal", "RN"]
];

const nomesHomens = ["Gabriel", "Lucas", "Mateus", "Felipe", "Rodrigo", "Ricardo", "Paulo", "Fernando", "Thiago", "Gustavo"];
const nomesMulheres = ["Ana", "Julia", "Beatriz", "Camila", "Letícia", "Patrícia", "Renata", "Helena", "Simone", "Alice"];
const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Ferreira", "Alves", "Rodrigues", "Martins"];

const planos = ["Unimed", "Amil", "Bradesco", "SulAmérica", "Porto Seguro"];

let sql = "-- Inserção de 50 Médicos\n\n";

for (let i = 1; i <= 50; i++) {
    const isMale = Math.random() > 0.5;
    const prefixo = isMale ? "Dr." : "Dra.";
    const nome = `${prefixo} ${isMale ? nomesHomens[Math.floor(Math.random() * nomesHomens.length)] : nomesMulheres[Math.floor(Math.random() * nomesMulheres.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`;
    const esp = especialidades[Math.floor(Math.random() * especialidades.length)];
    const [cidade, estado] = cidades[Math.floor(Math.random() * cidades.length)];
    const crm = `${Math.floor(Math.random() * 90000) + 10000}-${estado}`;
    const valor = Math.floor(Math.random() * 301) + 200;
    const nota = (Math.random() * 0.5 + 4.5).toFixed(1);
    const avaliacoes = Math.floor(Math.random() * 241) + 10;
    
    // Endereço JSONB
    const endereco = JSON.stringify({
        cidade,
        estado,
        logradouro: `Rua Exemplo ${i}`,
        numero: `${Math.floor(Math.random() * 2000) + 1}`,
        bairro: "Centro",
        cep: "00000-000",
        latitude: 0,
        longitude: 0
    });
    
    // Foto
    const foto = `/images/medicos/medico_${i}.png`;
    
    // Planos aceitos
    const aceita = planos.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    const planosSql = `ARRAY[${aceita.map(p => `'${p}'`).join(", ")}]`;

    // Seeder
    sql += `INSERT INTO medicos (nome, crm, especialidade_id, foto, bio, valor_consulta, nota, total_avaliacoes, endereco, planos_aceitos)\n`;
    sql += `VALUES ('${nome}', '${crm}', (SELECT id FROM especialidades WHERE nome = '${esp}' LIMIT 1), '${foto}', 'Especialista em ${esp} atuando em ${cidade}.', ${valor}, ${nota}, ${avaliacoes}, '${endereco}', ${planosSql});\n\n`;
}

fs.writeFileSync('c:/Users/david/OneDrive/BKP DAVID/DOCMATCH/data/medicos_seed.sql', sql);
console.log('SQL Seeder generated successfully!');
