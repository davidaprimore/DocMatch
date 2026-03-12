---
name: Mestre do Comparador de Preços de Medicamentos
description: Skill para implementar a lógica de busca, comparação e ranking de preços de medicamentos por farmácia no DocMatch.
---

# 💲 Skill: Comparador de Preços de Medicamentos

Você está implementando o **Comparador de Preços**, a funcionalidade diferencial do DocMatch. O objetivo é, dada uma lista de medicamentos de uma receita, encontrar as melhores opções por farmácia, calculando total da cesta e distância do usuário.

---

## Lógica de Busca

### Input
```typescript
interface ComparatorInput {
  medicamentos: Array<{
    nome: string           // nome do medicamento
    principio_ativo?: string
    concentracao?: string  // ex: "500mg"
    quantidade: number     // quantas caixas/unidades
  }>
  usuario_lat: number
  usuario_lng: number
  raio_km: number          // padrão: 10km
  canal?: 'balcao' | 'online' | 'ambos' // padrão: 'ambos'
}
```

### Output por farmácia
```typescript
interface FarmaciaResultado {
  farmacia: {
    id: string
    nome: string
    endereco: string
    distancia_km: number
    whatsapp?: string
    vende_online: boolean
  }
  medicamentos_encontrados: number         // quantos da receita têm preço
  medicamentos_total: number              // total de itens na receita
  cobertura_percentual: number            // medicamentos_encontrados / medicamentos_total
  itens: Array<{
    nome: string
    preco_unitario: number
    preco_total: number           // unitario × quantidade
    disponivel: boolean
    disponivel_online: boolean
  }>
  total_cesta: number                     // soma de todos os itens disponíveis
  total_cesta_formatado: string           // "R$ 45,30"
  economia_vs_mais_caro?: number          // diferença em R$ vs farmácia mais cara
}
```

---

## Fórmula de Haversine (Distância Geográfica)

```sql
-- Criar no Supabase SQL Editor — usado pela Edge Function
CREATE OR REPLACE FUNCTION distancia_km(
  lat1 FLOAT, lng1 FLOAT,
  lat2 FLOAT, lng2 FLOAT
) RETURNS FLOAT AS $$
  SELECT 6371 * acos(
    LEAST(1.0, GREATEST(-1.0,
      cos(radians(lat1)) * cos(radians(lat2)) *
      cos(radians(lng2) - radians(lng1)) +
      sin(radians(lat1)) * sin(radians(lat2))
    ))
  )
$$ LANGUAGE SQL IMMUTABLE;

-- Índice para busca geográfica nas farmácias
CREATE INDEX IF NOT EXISTS idx_farmacias_lat_lng ON farmacias(latitude, longitude);
```

---

## Query SQL de Comparação

```sql
-- Buscar preços de uma lista de medicamentos com distância filtrada
SELECT
  f.id AS farmacia_id,
  f.nome_fantasia,
  f.latitude,
  f.longitude,
  f.vende_online,
  f.whatsapp,
  m.nome_comercial,
  m.principio_ativo,
  pm.preco,
  pm.preco_promocional,
  pm.em_estoque,
  distancia_km(:user_lat, :user_lng, f.latitude, f.longitude) AS distancia
FROM precos_medicamentos pm
JOIN farmacias f ON pm.farmacia_id = f.id
JOIN medicamentos m ON pm.medicamento_id = m.id
WHERE
  m.principio_ativo ILIKE ANY(ARRAY[:principios_ativos])
  AND pm.em_estoque = TRUE
  AND distancia_km(:user_lat, :user_lng, f.latitude, f.longitude) <= :raio_km
  AND (:canal = 'ambos' OR (
    (:canal = 'online' AND f.vende_online = TRUE) OR
    (:canal = 'balcao' AND f.vende_online = FALSE)
  ))
ORDER BY distancia ASC, pm.preco ASC;
```

---

## Ordenação dos Resultados

O padrão exibido ao usuário é **"cesta mais barata primeiro"**, mas deve ser possível reordenar por:
1. 💰 **Menor preço total da cesta** (padrão)
2. 📍 **Menor distância**
3. ⭐ **Melhor avaliação**
4. ✅ **Maior cobertura** (tem mais medicamentos da receita)

---

## Dados Mock de Farmácias

```typescript
export const mockFarmacias = [
  {
    id: 'farm-01',
    nome: 'Droga Mais Nova Iguaçu',
    endereco: 'Av. Governador Roberto Silveira, 520 — Nova Iguaçu/RJ',
    latitude: -22.755,
    longitude: -43.458,
    vende_online: false,
    whatsapp: '(21) 98888-0001',
  },
  {
    id: 'farm-02',
    nome: 'Drogaria Centro NI',
    endereco: 'Rua Marechal Floriano, 123 — Nova Iguaçu/RJ',
    latitude: -22.758,
    longitude: -43.455,
    vende_online: false,
    whatsapp: '(21) 97777-0002',
  },
  {
    id: 'farm-03',
    nome: 'VidaSã Online',
    endereco: 'Online — entrega em todo o Brasil',
    latitude: 0,
    longitude: 0,
    vende_online: true,
    whatsapp: null,
  },
  {
    id: 'farm-04',
    nome: 'Farmácia Popular Saúde Total',
    endereco: 'Rua Dep. Bráulio Xavier, 88 — Nova Iguaçu/RJ',
    latitude: -22.752,
    longitude: -43.467,
    vende_online: false,
    whatsapp: '(21) 96666-0003',
  },
]

// Preços mock com variação (para demonstrar o comparador)
export const mockPrecos = [
  // Amoxicilina 500mg
  { farmacia_id: 'farm-01', nome: 'Amoxicilina 500mg', preco: 28.90 },
  { farmacia_id: 'farm-02', nome: 'Amoxicilina 500mg', preco: 24.50 },
  { farmacia_id: 'farm-03', nome: 'Amoxicilina 500mg', preco: 22.00 },
  { farmacia_id: 'farm-04', nome: 'Amoxicilina 500mg', preco: 31.00 },
  // Dipirona 500mg
  { farmacia_id: 'farm-01', nome: 'Dipirona 500mg', preco: 4.50 },
  { farmacia_id: 'farm-02', nome: 'Dipirona 500mg', preco: 5.20 },
  { farmacia_id: 'farm-03', nome: 'Dipirona 500mg', preco: 3.99 },
  { farmacia_id: 'farm-04', nome: 'Dipirona 500mg', preco: 4.80 },
  // Omeprazol 20mg
  { farmacia_id: 'farm-01', nome: 'Omeprazol 20mg', preco: 12.90 },
  { farmacia_id: 'farm-02', nome: 'Omeprazol 20mg', preco: 11.50 },
  { farmacia_id: 'farm-03', nome: 'Omeprazol 20mg', preco: 9.80 },
  { farmacia_id: 'farm-04', nome: 'Omeprazol 20mg', preco: 13.40 },
]
```

---

## Edge Function Supabase

**Nome:** `compare-prices`  
**Arquivo:** `supabase/functions/compare-prices/index.ts`

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const { medicamentos, usuario_lat, usuario_lng, raio_km = 10, canal = 'ambos' } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Buscar preços com distância
  const nomes = medicamentos.map((m: { nome: string }) => `%${m.nome}%`)
  
  const { data, error } = await supabase.rpc('buscar_precos_comparador', {
    p_lat: usuario_lat,
    p_lng: usuario_lng,
    p_raio: raio_km,
    p_nomes: nomes,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Agrupar por farmácia e calcular totais
  const porFarmacia = agruparPorFarmacia(data, medicamentos)
  const ordenado = porFarmacia.sort((a, b) => a.total_cesta - b.total_cesta)

  return new Response(JSON.stringify({ resultados: ordenado }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## UX do Comparador

- **Toggle "Por medicamento" / "Cesta completa"** — muda o agrupamento dos resultados
- **Badge "Economia de R$ X,XX"** no card da farmácia mais barata vs. mais cara
- **Chip "Online" ou "Balcão"** em destaque em cada card de farmácia
- **Botão "Como chegar"** → abre Google Maps com coordenadas
- **Botão "ChatWhatsApp"** → abre wa.me com mensagem pré-preenchida: "Olá! Gostaria de solicitar os seguintes medicamentos: [lista]"
- **Skeleton loading** enquanto carrega resultados
- **Empty state** se nenhuma farmácia tem o medicamento no raio
