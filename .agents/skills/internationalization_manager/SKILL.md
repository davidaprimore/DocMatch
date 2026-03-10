---
name: Gerente de Internacionalização (I18n Manager)
description: Prepara a arquitetura do aplicativo para tradução simultânea, manipulação de múltiplos fusos horários complexos (Agendamentos) e conversão de moeda/distância.
---

# 🌍 Gerente de Internacionalização (I18n) & Localização

## 📌 Objetivo
A DocMatch pode cruzar fronteiras. Se atuarmos na Europa ou EUA, a matriz do aplicativo precisa suportar mudança imediata de Idioma (PT-BR, EN-US, ES-ES), manipulação das moedas e, sobretudo, os complexos Fusos Horários que envolvem médicos e pacientes e telemedicina em países distintos.

## ⚙️ Diretrizes Base Globais

### 1. Dicionário Desacoplado (i18next)
- Qualquer Agente que for introduzir "labels", "botões" e "textos grandes" no front-end NÃO deve hardcodear os valores diretamente no JSX se a rota possuir plano de expansão.
- Exemplos: Em vez de `<h1>Bem-vindo</h1>`, utiliza-se a extração hook baseada em chave: `<h1>{t("dashboard.welcome")}</h1>`.
- Arquivos `.json` de dicionário ficarão armazenados no diretório de `locales/`.

### 2. Guerra de Fusos (Timezones Médicos x Pacientes)
- Na aba `Agendar.tsx` (que mostra slots rápidos "16:30"), QUAL é o fuso de "16:30"?
- **Regra Imutável Master (I18n):** Todo dado de data salvo no banco (Supabase) via Agente QA ou Back-End deve OBRIGATORIAMENTE ser em "UTC Puro" (`ISO 8601`, ex: `2024-03-10T15:30:00Z`).
- O Front-End React converte esse "UTC" estrito para a LocalTime (`Intl.DateTimeFormat().resolvedOptions().timeZone`) do paciente APENAS na hora da renderização final para visualização UI.

### 3. Dinheiro e Formatação de Telefone
- Componente `Consultar Preços` (`Dashboard.tsx` ou similar).
- Valores como `R$ 450,00` não podem ser texto bruto gravado.
- Utilizar sempre `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)` para suportar câmbio `USD` amanhã sem reescrever o componente.

## 🛠️ Procedimento de Execução
Ao comando, os Agentes Front e PM requisitam do Gerente I18n os scripts de configuração da biblioteca `react-i18next` ou utilidades customizadas `date-fns-tz` para lidar com conversão. Essa skill atuará nos formulários revisando mascaras de telefone que suportem formatadores DDI global (`+1`, `+55`, `+351`).
