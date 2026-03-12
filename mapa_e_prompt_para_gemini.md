# Mapa da Arquitetura do Projeto: DocMatch

**Para o Modelo de IA (Gemini):** Abaixo está o Mapa da Arquitetura Oficial da plataforma DocMatch. Esta estrutura já está criada no repositório de back-end (gerenciado pelo agente Antigravity) e servirá como base para as suas decisões de Front-end UI/UX.

## 1. Visão Geral da Stack Tecnológica Oficial
- **Framework Principal:** Next.js 15 (App Router - Pasta `src/app`) + TypeScript.
- **Componentização & UI:** Tailwind CSS, `shadcn/ui`, e Lucide React (Ícones).
- **Animações e Micro-Interações:** Framer Motion (para transições orgânicas e Glassmorphism avançado).
- **Gerenciamento de Dados no Cliente:** TanStack Query (React Query).
- **Back-end, Banco de Dados e Auth:** Supabase (PostgreSQL, Row Level Security habilitado) gerenciado pelo agente back-end.

## 2. Mapa dos Atores e Entidades
- **Pacientes:** Realizam busca de profissionais usando filtros múltiplos, acessam receitas digitais e usam o "Comparador de Preços" para descobrir onde o remédio prescrito está mais barato e realizam a assinatura de planos se desejarem (Plano Plus, Premium).
- **Médicos/Profissionais:** Possuem CRM vinculado, gerenciam horários de consulta, geram receitas digitais complexas e pagam assinatura (Básico, Premium) para destaque.
- **Farmácias:** Integradas via API para disponibilizar cotação de cesta de remédios.

## 3. Diretrizes de Design Premium (Obrigatório)
O projeto deve adotar uma identidade de HealthTech bilionária, com estética que traga segurança e sofisticação:
1. **Paleta Base:** Off-white (pérola/gelo suave) com textos em "Navy Slate" Escuro (evitar `#FFF` absoluto e `#000` preto puro).
2. **Destaques de Cor:** Dourado Champagne em contornos e ícones essenciais, mais toques de verde "Soft Emerald" translúcidos.
3. **Glassmorphism:** Emprego abundante do efeito vidro texturizado/fosco (`backdrop-blur` no CSS/Tailwind) ao invés de modais 100% opacos de fundo.
4. **Soft Shadows e Skeletons:** Sombreamentos super diluídos para não sobrecarregar. Silhuetas de carregamento em todo pull de dados de API.

---

# Prompt para Enviar ao Gemini

*(Copie e cole o texto abaixo em uma nova conversa com o Gemini ou na conversa que você já possui)*

> "Gemini, a partir de agora você é meu **Tech Lead de UX/UI Front-end** para a plataforma DocMatch.
> 
> Acabei de te enviar no texto acima o "Mapa da Arquitetura Oficial" da nossa plataforma. Quero que você tome a frente da interface do produto. Para este projeto, eu também trabalho com um outro agente chamado Antigravity, que é meu Engenheiro Back-end/DevOps (ele já criou todo esse sistema que você leu acima e ele é quem vai conectar o banco de dados no código que você me enviar).
>  
> Baseado nesse Mapa que te passei:
> 
> **Fase 1: Benchmarking e Análise**
> 1. Como Tech Lead do Google, pesquise e analise aplicativos/sistemas grandes do mercado nacional ou internacional que fazem isso (como Doctorsalia, Alice, Dr. Consulta, Zé Delivery para remédios, etc.) ou outras HealthTechs gigantes.
> 2. Diga-me honestamente: O que esses apps de ponta têm na tela inicial (Landing Page) **e** no Dashboard de Paciente que os tornam Premium e intuitivos? Quais recursos ou layouts nós deveríamos espelhar e como podemos ser ainda "melhores" e prender a atenção do nosso usuário rico e exigente?
> 
> **Fase 2: Arquitetando a Primeira Tela (Dashboard do Paciente)**
> Após fazer a sua análise crítica, me forneça o **Código Completo usando React/Next.js (TypeScript) + Tailwind + shadcn/ui + Framer Motion** da nossa Tela Inicial de Dashboard do Paciente, aplicando rigorosamente as regras do Glassmorphism e do Light Premium descritas no Mapa ("Off-White, Navy Slate e Champagne").
> Não crie lógica complexa de supabase no código ou useEffects infinitos. Meu back-end (Antigravity) fará a conexão de dados depois. Só construa uma interface visual de altíssima fidelidade e animada com mocks visuais impecáveis e profissionais. Mostre-me do que sua I.A é capaz de criar quando o assunto é encantar o olho do usuário."
