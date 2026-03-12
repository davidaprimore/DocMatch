---
name: Engenheiro de Analytics e Inteligência de Negócio (BI / Tracking)
description: Constrói ganchos de telemetria baseados na conversão médica (Agendamento, Assinaturas Pro-Max), montando estruturas prontas para Tag Manager / Mixpanel.
---

# 📊 Engenheiro de Analytics e Tracking de Conversão

## 📌 Objetivo
Para gerir um ecossistema da saúde, a DocMatch precisa basear suas decisões em Dados Reais (Data Driven). Esta skill injeta eventos estruturados para mapearmos o funil de agendamentos e cancelamentos, monitorando de "onde" os pacientes desistem ou assinam planos.

## ⚙️ Regras do Flow Data

### 1. Estruturação do Dicionário de Dados
- Tudo o que o usuário clica ou visualiza e é central no negócio deve ser "tagueado" no backend ou via disparo front-end usando ganchos neutros customizados.
- **Eventos de Origem Exigidos:**
  - `view_doctor_profile`: Ao abrir o card de um médico (parametros: doctor_id, doctor_specialty, view_source).
  - `initiate_booking`: Ao selecionar o horário na tela de Agendar.
  - `complete_booking`: Disparado apenas após o Supabase confirmar criação do ID do evento no banco e no Calendário.
  - `abandon_cart_booking`: Paciente selecionou horário, chegou a Confirmação e apertou X / Voltar sem concluir.

### 2. Abstração de Eventos Isolada
- Evitar poluição acoplada!
- Criar a pasta e hook único `useAnalytics()` em que todas as lógicas complexas de captura para GA4, MixPanel, ou Datadog ocorram. Os Componentes-Pai apenas chamam:
`trackEvent('initiate_booking', { especialidade: "Cardio" })`

### 3. Integração com o Workflow LGPD (Privacy Data Policy)
- **Crítico Legal / Negócios:** NUNCA gravar ou repassar dados PII (Personally Identifiable Information como CPF, RG, Nome Completo ou Doenças Sensíveis) nos DataLayers e Trackers de Terceiros (MetaPixel / Google Analytics).
- Se a busca feita foi "Sintoma Gonorreia", a *Event Table* mandará `{ user_id: '45-bca-s-8', search_category: 'sensitive_symptom_2'}` e não a palavra chave em cru para bases cloud mercadológicas. Somente a Supabase protegida (RLS) sabe o real valor da chave.

## 🛠️ Procedimento de Execução
Ao ser requisitada, essa skill instruirá a orquestração do PM a planejar uma tabela robusta no banco orientada a eventos, montará a camada de Hooks e distribuirá ao Front-End os locais exatos onde devem-se injetar coletores, para que amanhã os BI da DocMatch tenham as métricas e o Dashboard de Crescimento já operante.
