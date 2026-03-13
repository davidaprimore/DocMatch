import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'
 
export interface ItemCesta {
    id: string                 // medicamento.id
    nome: string
    principio_ativo: string
    concentracao: string
    farmacia_id: string
    farmacia_nome: string
    preco_unitario: number
    quantidade: number
    distancia_km?: number
    whatsapp?: string
    farmacia_lat?: number
    farmacia_lng?: number
    priceVariation?: 'up' | 'down' | 'none'
    isCheapest?: boolean
}
 
interface CartState {
    itens: ItemCesta[]
    total: number
    count: number
}
 
const BASE_CART_KEY = 'docmatch_cesta'
 
function calcular(itens: ItemCesta[]): CartState {
    const total = itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0)
    const count = itens.reduce((acc, i) => acc + i.quantidade, 0)
    return { itens, total, count }
}
 
export function useCart() {
    const { user } = useAuth()
    const [state, setState] = useState<CartState>({ itens: [], total: 0, count: 0 })
 
    const CART_KEY = user ? `${BASE_CART_KEY}_${user.id}` : BASE_CART_KEY
 
    // Carregar do localStorage na inicialização ou quando o usuário mudar
    useEffect(() => {
        if (!user) {
            setState({ itens: [], total: 0, count: 0 })
            return
        }
 
        try {
            const raw = localStorage.getItem(CART_KEY)
            if (raw) {
                const itens: ItemCesta[] = JSON.parse(raw)
                setState(calcular(itens))
            } else {
                setState({ itens: [], total: 0, count: 0 })
            }
        } catch { 
            setState({ itens: [], total: 0, count: 0 })
        }
    }, [user, CART_KEY])
 
    const salvar = useCallback((itens: ItemCesta[]) => {
        localStorage.setItem(CART_KEY, JSON.stringify(itens))
        setState(calcular(itens))
    }, [CART_KEY])
 
    const adicionar = useCallback((item: Omit<ItemCesta, 'quantidade'> & { quantidade?: number }) => {
        setState(prev => {
            const existe = prev.itens.findIndex(i => i.id === item.id && i.farmacia_id === item.farmacia_id)
            let novos: ItemCesta[]
            if (existe >= 0) {
                novos = prev.itens.map((i, idx) =>
                    idx === existe ? { ...i, quantidade: i.quantidade + (item.quantidade ?? 1) } : i
                )
            } else {
                novos = [...prev.itens, { ...item, quantidade: item.quantidade ?? 1 }]
            }
            localStorage.setItem(CART_KEY, JSON.stringify(novos))
            return calcular(novos)
        })
    }, [CART_KEY])
 
    const remover = useCallback((id: string, farmacia_id: string) => {
        setState(prev => {
            const novos = prev.itens.filter(i => !(i.id === id && i.farmacia_id === farmacia_id))
            localStorage.setItem(CART_KEY, JSON.stringify(novos))
            return calcular(novos)
        })
    }, [CART_KEY])
 
    const atualizarQuantidade = useCallback((id: string, farmacia_id: string, quantidade: number) => {
        setState(prev => {
            const novos = quantidade <= 0
                ? prev.itens.filter(i => !(i.id === id && i.farmacia_id === farmacia_id))
                : prev.itens.map(i => i.id === id && i.farmacia_id === farmacia_id ? { ...i, quantidade } : i)
            localStorage.setItem(CART_KEY, JSON.stringify(novos))
            return calcular(novos)
        })
    }, [CART_KEY])
 
    const limpar = useCallback(() => {
        localStorage.removeItem(CART_KEY)
        setState({ itens: [], total: 0, count: 0 })
    }, [CART_KEY])
 
    // Itens agrupados por farmácia
    const porFarmacia = state.itens.reduce<Record<string, { farmacia_nome: string; farmacia_id: string; distancia_km?: number; whatsapp?: string; lat?: number; lng?: number; itens: ItemCesta[]; subtotal: number }>>((acc, item) => {
        if (!acc[item.farmacia_id]) {
            acc[item.farmacia_id] = {
                farmacia_id: item.farmacia_id,
                farmacia_nome: item.farmacia_nome,
                distancia_km: item.distancia_km,
                whatsapp: item.whatsapp,
                lat: item.farmacia_lat,
                lng: item.farmacia_lng,
                itens: [],
                subtotal: 0,
            }
        }
        acc[item.farmacia_id].itens.push(item)
        acc[item.farmacia_id].subtotal += item.preco_unitario * item.quantidade
        return acc
    }, {})
 
    return {
        itens: state.itens,
        total: state.total,
        count: state.count,
        porFarmacia,
        adicionar,
        remover,
        atualizarQuantidade,
        limpar,
        salvar,
    }
}
