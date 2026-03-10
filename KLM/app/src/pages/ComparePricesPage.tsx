import { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  MapPin, 
  SlidersHorizontal, 
  Store, 
  Truck, 
  Clock,
  ChevronLeft,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PharmacyCard } from '@/components/PharmacyCard';
import { usePharmacySearch } from '@/hooks/useSearch';
import { useLocation } from '@/hooks/useLocation';
import { receitaMock, comparacaoPrecosMock } from '@/data/mockData';
import { toast } from 'sonner';

export function ComparePricesPage() {
  const { location, requestLocation } = useLocation();
  const { comparePrices, isLoading } = usePharmacySearch();
  const [results, setResults] = useState(comparacaoPrecosMock);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    raioKm: 10,
    entregaOnline: true,
    apenas24h: false,
  });

  const medicamentos = receitaMock.medicamentos;

  useEffect(() => {
    // Carregar comparação de preços
    loadComparison();
  }, []);

  const loadComparison = async () => {
    const medicamentosIds = medicamentos.map(m => `med_base_00${m.id.slice(-1)}`);
    const comparison = await comparePrices(
      medicamentosIds,
      location || undefined
    );
    setResults(comparison);
  };

  const handleBuyOnline = (_farmaciaId: string) => {
    toast.success('Redirecionando para a farmácia...');
  };

  const handlePickup = (_farmaciaId: string) => {
    toast.success('Farmácia selecionada para retirada!');
  };

  const melhorPreco = results[0];
  const economiaTotal = results[results.length - 1]?.preco_total_cesta - melhorPreco?.preco_total_cesta;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] pb-24">
      <Header userType="paciente" />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-400 hover:text-white -ml-4"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-[hsl(222,47%,12%)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Comparar Preços</h1>
              <p className="text-gray-400">Encontre o melhor preço para seus medicamentos</p>
            </div>
          </div>
        </div>

        {/* Medicines Summary */}
        <Card className="mb-6 bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-[hsl(45,80%,47%)]" />
              <h3 className="font-semibold text-white">Sua cesta ({medicamentos.length} itens)</h3>
            </div>
            <div className="space-y-2">
              {medicamentos.map((med) => (
                <div key={med.id} className="flex items-center justify-between py-2 px-3 bg-[hsl(222,47%,12%)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(222,35%,20%)] flex items-center justify-center">
                      <span className="text-xs font-medium text-[hsl(45,80%,47%)]">
                        {med.quantidade}x
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-white">{med.nome}</p>
                      <p className="text-xs text-gray-500">{med.concentracao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Price Alert */}
        {melhorPreco && economiaTotal > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-green-500/20 to-green-600/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-400">
                    Você pode economizar até
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {economiaTotal.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {location ? 'Usando sua localização' : 'Localização não disponível'}
            </span>
          </div>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full sm:w-[350px] bg-[hsl(222,47%,12%)] border-l border-[hsl(222,20%,25%)]"
            >
              <SheetHeader>
                <SheetTitle className="text-white">Filtros</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Location Radius */}
                {location && (
                  <div>
                    <Label className="text-gray-300 mb-3 block">
                      Raio de busca: {filters.raioKm} km
                    </Label>
                    <Slider
                      value={[filters.raioKm]}
                      onValueChange={(value) => setFilters({ ...filters, raioKm: value[0] })}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Online Delivery */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(222,35%,20%)] flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                    </div>
                    <div>
                      <p className="text-white">Entrega online</p>
                      <p className="text-xs text-gray-500">Apenas farmácias com delivery</p>
                    </div>
                  </div>
                  <Switch
                    checked={filters.entregaOnline}
                    onCheckedChange={(checked) => setFilters({ ...filters, entregaOnline: checked })}
                  />
                </div>

                {/* 24h */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(222,35%,20%)] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                    </div>
                    <div>
                      <p className="text-white">Farmácia 24h</p>
                      <p className="text-xs text-gray-500">Apenas farmácias abertas 24 horas</p>
                    </div>
                  </div>
                  <Switch
                    checked={filters.apenas24h}
                    onCheckedChange={(checked) => setFilters({ ...filters, apenas24h: checked })}
                  />
                </div>

                <Button
                  onClick={() => {
                    loadComparison();
                    setShowFilters(false);
                  }}
                  className="w-full h-12 gold-gradient text-[hsl(222,47%,12%)] font-semibold"
                >
                  Aplicar filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Location Warning */}
        {!location && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-400 flex-1">
              Ative a localização para ver distâncias e ordenar por proximidade
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={requestLocation}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Ativar
            </Button>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {isLoading ? 'Buscando preços...' : `${results.length} farmácias encontradas`}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-[hsl(222,35%,20%)] animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-1/3 bg-[hsl(222,35%,20%)] rounded animate-pulse" />
                        <div className="h-4 w-1/4 bg-[hsl(222,35%,20%)] rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-[hsl(222,35%,20%)] rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <PharmacyCard
                  key={result.farmacia.id}
                  result={result}
                  rank={index + 1}
                  onBuyOnline={() => handleBuyOnline(result.farmacia.id)}
                  onPickup={() => handlePickup(result.farmacia.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma farmácia encontrada
              </h3>
              <p className="text-gray-400 mb-6">
                Tente aumentar o raio de busca ou remover alguns filtros
              </p>
              <Button
                onClick={() => {
                  setFilters({ raioKm: 50, entregaOnline: false, apenas24h: false });
                  loadComparison();
                }}
                variant="outline"
                className="border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav activeTab="menu" />
    </div>
  );
}
