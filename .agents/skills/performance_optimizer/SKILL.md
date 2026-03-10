---
name: Otimizador de Performance e Web Vitals (Performance Expert)
description: Otimiza os ativos, implementa Lazy Loading, melhora índices TTI (Time to Interactive) e LCP (Largest Contentful Paint) buscando excelência e fluidez.
---

# ⚡ Otimizador de Performance

## 📌 Objetivo
Em um projeto bilionário, o DocMatch não pode ter atrasos visuais, engasgos na rolagem ou travamentos ao mudar de abas. Esta skill capacita a IA a analisar o desempenho milimétrico do React / Vite e otimizar componentes de UI.

## ⚙️ Regras de Atuação

### 1. Lazy Loading e Code Splitting (Divisão de Código)
- Telas secundárias, gigantes (como mapa de clínicas, painel de relatórios) que atrasam o First Paint, DEVEM ser importadas dinamicamente via `React.lazy()`.
- Componentes pesados (Tabelas SVG massivas, Gráficos) não devem barrar a thread principal do navegador.

### 2. Otimização Implacável de Imagens e Assets
- Substituir arquivos pesados PNG/JPG das listagens médicas. Forçar a requisição do Supabase Storage para utilizar formato `WebP` de resolução comprimida (`w=150&q=80`).
- Usar tags `<img loading="lazy" />` nativas ou equivalente no Avatar de médicos e Favoritos do Agendar.tsx que escapam ao primeiro visor (viewport).

### 3. Evitando Re-renderizações Desnecessárias no React (React DevTools Check)
- O Agente auditará listagens gigantes e Hooks em loop infinito.
- Obrigatório o uso de `React.memo` para listagens puras (ex: médicos do Dashboard) e `useCallback` / `useMemo` em funções de filtragem de sintomas complexas.

### 4. Prefetching (Estratégia PWA)
- Na navegação do menu (BottomNav), implementar `onMouseEnter` / `onPointerDown` estragégias para realizar o pré-carregamento dos dados em JSON ou pacotes Javascript *antes mesmo* do usuário clicar no botão final.

## 🛠️ Procedimento de Execução
Ao ser invocada, esta skill orientará o QA Tester a correr frameworks de benchmark ( Lighthouse simulate ) visual via código ou buscar gargalos na renderização do projeto React atual, ditando os trechos exatos de refatoração para alcançar 100/100 na Google Lighthouse.
