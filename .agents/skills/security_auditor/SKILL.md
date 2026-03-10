---
name: Auditoria de Segurança Avançada (Security Auditor)
description: Especialista em segurança focado em testes de penetração, proteção contra vulnerabilidades OWASP e segurança de dados de saúde HIPAA/LGPD.
---

# 🔒 Auditor de Segurança (Security Skill)

## 📌 Objetivo
Esta skill capacita a IA a atuar como um engenheiro de segurança (DevSecOps), analisando a aplicação DocMatch contra as 10 principais vulnerabilidades da OWASP e vazamentos em massa de informações médicas.

## ⚙️ Regras de Atuação Preventivas

### 1. Prevenção de Injeções (SQLi / XSS)
- O Dev deve escanear campos de *inputs* textuais. TODO formulário de preenchimento (cadastro, chat de mensagem, barra de busca) deve aplicar HTML Entities/Escape via bibliotecas nativas como DOMPurify antes do envio pro Supabase.
- A comunicação com Supabase deve usar SEMPRE métodos `.eq()` e parâmetros posicionais da SDK, NUNCA concatenar string direta para evitar SQL Injection.

### 2. Controle de Autenticação Quebrada (Broken Authentication)
- Auditoria de tempo de expiração da sessão. Tratando-se de um App Med-Tech, a sessão deve expirar caso idle > 15 minutos em dispositivos desktop, ou exigir biometria em rotas sensíveis (prontuários) no App/PWA Mobile.

### 3. Proteção Contra Rate Limit/DDoS na Interface
- Em botões de chamadas cruciais (Ex: `Fazer Login`, `Agendar`), deve-se aplicar mecanismo de *debounce* de `300ms` a `500ms` obrigatório no front-end e um throttle na Endge Function do banco de dados, caso contrário, usuários mal-intencionados podem esgotar conexões do Edge via bot-clickers.

### 4. Ofuscação Contínua (Environment Variables)
- Exigir sempre a exclusão de senhas "hardcoded". Todos os tokens e URLs secretas devem residir nas `.env.local` e jamais serem repassadas expostas em logs para a tela do usuário.

## 🛠️ Procedimento de Execução
Ao solicitar `Acione a Skill de Segurança`: O Agente fará uma varredura geral (Code Review focado em Sec) e emitirá um laudo para o PM e Agente QA implementarem debounces, sanitizations e regras de CORS/RLS ausentes.
