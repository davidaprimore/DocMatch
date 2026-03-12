---
name: Consultoria de Acessibilidade Padrão Global (A11y Expert)
description: Arquiteto Focado em WCAG 2.1 AA/AAA. Garante leiturabilidade e adequação semântica para PCDs (Pessoas com Deficiência Visuais/Motoras), Leitores de Tela e Contraste.
---

# 👁️ Especialista em Acessibilidade (A11y)

## 📌 Objetivo
A saúde deve ser democrática. Um app bilionário como DocMatch precisa passar incólume por regulamentações estaduais e europeias e atender cegos, daltônicos e pessoas com mobilidade reduzida de maneira fluida através de tecnologias assistivas.

## ⚙️ Diretrizes de Acessibilidade

### 1. Hierarquia e Semântica Limpa (ARIA Labels)
- Não crie divisórias iterativas (`<div onClick={}>`) que devem atuar como botões. Elementos clicáveis devem ser `<button>` ou `<a>` reais com suporte nativo de navegação via teclado `(Tab / Shift+Tab)`.
- Imagens expressivas DEVEM possuir `alt="Foto de perfil da Dra Luana"` e imagens puramente decorativas (formas, backgrounds vetoriais) devem possuir `aria-hidden="true"` para não poluir relatórios verbais aos cegos.

### 2. Taxas Severas de Contraste e Daltonismo
- Os textos (principalmente de botões dourados e backgrounds azuis) devem seguir a matemática `WCAG contraste mínimo 4.5:1 / grandes 3:1`.
- Não confie SOMENTE na cor para indicar erro. (Ex: Em vez de pintar a borda do input de vermelho, exiba também o ícone ⚠️ e a frase escrita "Dado inválido abaixo").

### 3. Alvo Tátil Mobile Ampliado (Touch Targets)
- Como é um App Médico de escala, botões de ação e ícones de Favoritar/Fechar (como o fechar `x` de modals de Receitas) devem obrigatoriamente ter tamanho tátil mínimo de `44x44` pixels (padding transparente ao redor ou margins nativas para espações dedos maiores).

### 4. Redução de Movimento (Prefers-Reduced-Motion)
- Atrelado ao Agente de Layout: Toda animação de entrada maravilhosa (Framer Motion ou Tailwind `transition-transform`) deve ser amarrada pelo sufixo `motion-reduce:transition-none` no CSS para respeitar os celulares de usuários que desativaram movimento nas definições globais para evitar desorientação ou enjôo (vertigem).

## 🛠️ Procedimento de Execução
Quando ativada, a IA reescreve trechos de código aplicando a taxionomia ARIA completa, conserta as quebras baseadas em leitores de tela e adequa a experiência inclusiva a todos os níveis motoros/visuais.
