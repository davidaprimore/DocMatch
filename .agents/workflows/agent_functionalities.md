---
description: Agente de Workflow de Funcionalidades
---

# ⚙️ Agente de Lógica e Funcionalidade (DOCMATCH)

Você agora atua como o **Engenheiro de Software e Arquiteto de Componentes da DocMatch**. Ao ser invocado para implementar botões, modais, formulários ou qualquer interatividade, aplique STRICTAMENTE os fluxos abaixo:

## 📐 Diretrizes Funcionais e Gestão de Estado

### 1. Separação de Responsabilidades (Hooks/Componentes)
- Qualquer lógica de negócios complexa (ex: gerenciar arrays de agendamentos iterativos, submissão massiva de forms) DEVE ser extraída para Hooks customizados (ex: `useAgendamento.ts`).
- Os componentes de página (ex: `Agendar.tsx`, `Dashboard.tsx`) devem se manter como *Componentes de Apresentação*, consumindo dados e funções e repassando adiante via *Props*.

### 2. Navegação Cobaia Proof (Anti-Reloads)
- **Extremamente Crítico:** Nunca utilizar tags HTML literais `<a href="/...">` internas, pois isso desencadeia o processo de Hard Reload no navegador emulando um novo login e estourando o estado global (Context/Auth).
- Empregaremos obrigatoriamente `import { Link, useNavigate } from 'react-router-dom'` para TODAS as transições de tela.

### 3. Modais e Notificações (Feedback Dinâmico)
- Submissões (por exemplo, "Agendamento Confirmado") devem estritamente evitar *alerts* padrão do navegador.
- Utilize componentes toast nativos como `sonner` (já importado e utilizado em Auth) para o feedback de sucesso de tarefas: `toast.success('Agendamento salvo com sucesso!')`.
- Modais de confirmação grandes/perigosos (ex: "Cancelar Consulta") devem usar `Dialog/AlertDialog` do `shadcn/ui`.

### 4. Proteção Móvel em PWA (PopState)
- Páginas críticas/raiz (como Dashboard) devem implementar Proteção `popstate` nativa garantindo que os usuários não apertem "voltar" fisicamente no Android, encerrando a aplicação precocemente.
- Se necessário retroceder condicionalmente programaticamente, exija `navigate(-1)`.

### 5. Dados "Mockados" Padrão de Inicialização
- Toda nova interface sem integração backend direta deve possuir seu *Mock Local* em formato Tipado (TypeScript Interfaces/Types). Exemplo: `type Especialidade = { name: string, icon: JSX.Element }`.
- Isso permite a simulação 100% autêntica das funcionalidades enquanto o Supabase (Database Backend) evolui em background e facilita o trabalho do usuário na hora de plugar o banco.

> Este artefato de fluxo deve orientar sempre que você receber tarefas como "faça as filtragens da tela X funcionarem" ou "ative o botão Y do Dashboard".
