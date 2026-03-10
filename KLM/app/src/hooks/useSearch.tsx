import { useState, useCallback } from 'react';
import { medicosMock, farmaciasMock, medicamentosMock } from '@/data/mockData';
import type { FiltroBusca, FiltroFarmacia, ResultadoComparacao } from '@/types';
import { calculateDistance } from './useLocation';

// Hook para busca de médicos
export function useDoctorSearch() {
  const [filters, setFilters] = useState<FiltroBusca>({});
  const [isLoading, setIsLoading] = useState(false);

  // ANTEGRAVITY: Implementar busca real no Supabase
  // - Criar índices para especialidade, localização, planos de saúde
  // - Implementar busca geoespacial com PostGIS
  // - Adicionar full-text search para nomes
  // - Implementar paginação
  // - Cache de resultados frequentes

  const searchDoctors = useCallback(async (searchFilters: FiltroBusca) => {
    setIsLoading(true);
    
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = [...medicosMock];

    // Filtrar por especialidade
    if (searchFilters.especialidade) {
      results = results.filter(d => 
        d.especialidade.toLowerCase().includes(searchFilters.especialidade!.toLowerCase())
      );
    }

    // Filtrar por plano de saúde
    if (searchFilters.plano_saude) {
      results = results.filter(d =>
        d.planos_saude_aceitos.some(p => 
          p.nome.toLowerCase().includes(searchFilters.plano_saude!.toLowerCase())
        )
      );
    }

    // Filtrar por valor máximo
    if (searchFilters.valor_maximo) {
      results = results.filter(d => d.valor_consulta <= searchFilters.valor_maximo!);
    }

    // Filtrar por avaliação mínima
    if (searchFilters.avaliacao_minima) {
      results = results.filter(d => d.avaliacao >= searchFilters.avaliacao_minima!);
    }

    // Filtrar por destaque
    if (searchFilters.apenas_destaque) {
      results = results.filter(d => d.destaque);
    }

    // Ordenar por distância se localização fornecida
    if (searchFilters.localizacao) {
      results = results.map(d => ({
        ...d,
        distance: calculateDistance(
          searchFilters.localizacao!.latitude,
          searchFilters.localizacao!.longitude,
          d.endereco_consultorio.latitude!,
          d.endereco_consultorio.longitude!
        )
      })).sort((a, b) => (a as any).distance - (b as any).distance);

      // Filtrar por raio
      if (searchFilters.localizacao.raio_km) {
        results = results.filter(d => 
          (d as any).distance <= searchFilters.localizacao!.raio_km
        );
      }
    }

    setIsLoading(false);
    return results;
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FiltroBusca>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    updateFilters,
    searchDoctors,
    isLoading,
  };
}

// Hook para busca de farmácias e comparação de preços
export function usePharmacySearch() {
  const [filters, setFilters] = useState<FiltroFarmacia>({});
  const [isLoading, setIsLoading] = useState(false);

  // ANTEGRAVITY: Implementar integração com APIs das farmácias
  // - Criar serviço de agregação de preços
  // - Implementar cache de preços (atualizar a cada X minutos)
  // - Criar fila para sincronização de estoque
  // - Fallback para dados mock quando API indisponível

  const searchPharmacies = useCallback(async (searchFilters: FiltroFarmacia) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let results = [...farmaciasMock];

    // Filtrar por entrega online
    if (searchFilters.entrega_online !== undefined) {
      results = results.filter(f => f.entrega_online === searchFilters.entrega_online);
    }

    // Filtrar por 24h
    if (searchFilters._24h) {
      results = results.filter(f => f.horario_funcionamento._24h);
    }

    // Ordenar por distância
    if (searchFilters.localizacao) {
      results = results.map(f => ({
        ...f,
        distance: calculateDistance(
          searchFilters.localizacao!.latitude,
          searchFilters.localizacao!.longitude,
          f.endereco.latitude!,
          f.endereco.longitude!
        )
      })).sort((a, b) => (a as any).distance - (b as any).distance);

      if (searchFilters.localizacao.raio_km) {
        results = results.filter(f => 
          (f as any).distance <= searchFilters.localizacao!.raio_km
        );
      }
    }

    setIsLoading(false);
    return results;
  }, []);

  // Comparar preços de medicamentos em várias farmácias
  const comparePrices = useCallback(async (
    medicamentosIds: string[],
    userLocation?: { latitude: number; longitude: number }
  ): Promise<ResultadoComparacao[]> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // ANTEGRAVITY: Implementar lógica real de comparação
    // - Buscar preços de todas as farmácias parceiras
    // - Calcular total da cesta para cada farmácia
    // - Ordenar por menor preço total
    // - Calcular economia vs. opção mais cara
    
    const resultados: ResultadoComparacao[] = farmaciasMock.map(farmacia => {
      const medsFarmacia = medicamentosMock.filter(m => 
        m.farmacia_id === farmacia.id && 
        medicamentosIds.includes(m.medicamento_id)
      );

      const medicamentosResult = medsFarmacia.map(med => ({
        medicamento: med,
        quantidade: 1,
        preco_unitario: med.preco_promocional || med.preco,
        preco_total: (med.preco_promocional || med.preco) * 1,
      }));

      const precoTotal = medicamentosResult.reduce((sum, m) => sum + m.preco_total, 0);

      let distancia: number | undefined;
      if (userLocation && farmacia.endereco.latitude && farmacia.endereco.longitude) {
        distancia = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          farmacia.endereco.latitude,
          farmacia.endereco.longitude
        );
      }

      return {
        farmacia,
        medicamentos: medicamentosResult,
        preco_total_cesta: precoTotal,
        economia_vs_mais_caro: 0, // Calculado depois
        distancia_km: distancia,
        tempo_entrega: farmacia.entrega_online ? '45-60 min' : undefined,
      };
    });

    // Calcular economia vs. mais caro
    const prices = resultados.map(r => r.preco_total_cesta).filter((p): p is number => p !== undefined);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    resultados.forEach(r => {
      if (r.preco_total_cesta !== undefined) {
        r.economia_vs_mais_caro = maxPrice - r.preco_total_cesta;
      }
    });

    // Ordenar por preço total
    resultados.sort((a, b) => a.preco_total_cesta - b.preco_total_cesta);

    setIsLoading(false);
    return resultados;
  }, []);

  return {
    filters,
    setFilters,
    searchPharmacies,
    comparePrices,
    isLoading,
  };
}
