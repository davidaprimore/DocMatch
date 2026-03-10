import { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
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
import { DoctorCard } from '@/components/DoctorCard';
import { useDoctorSearch } from '@/hooks/useSearch';
import { useLocation } from '@/hooks/useLocation';
import { especialidadesMock, planosSaude } from '@/data/mockData';

export function SearchDoctorsPage() {
  const { location, requestLocation } = useLocation();
  const { searchDoctors, isLoading } = useDoctorSearch();
  const [doctors, setDoctors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    especialidade: '',
    planoSaude: '',
    valorMaximo: 500,
    avaliacaoMinima: 0,
    apenasDestaque: false,
    raioKm: 10,
  });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    const results = await searchDoctors({
      especialidade: filters.especialidade || undefined,
      plano_saude: filters.planoSaude || undefined,
      valor_maximo: filters.valorMaximo,
      avaliacao_minima: filters.avaliacaoMinima,
      apenas_destaque: filters.apenasDestaque,
      localizacao: location ? {
        latitude: location.latitude,
        longitude: location.longitude,
        raio_km: filters.raioKm,
      } : undefined,
    });
    setDoctors(results as any);
  };

  const clearFilters = () => {
    setFilters({
      especialidade: '',
      planoSaude: '',
      valorMaximo: 500,
      avaliacaoMinima: 0,
      apenasDestaque: false,
      raioKm: 10,
    });
  };

  const activeFiltersCount = [
    filters.especialidade,
    filters.planoSaude,
    filters.valorMaximo !== 500,
    filters.avaliacaoMinima > 0,
    filters.apenasDestaque,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] pb-24">
      <Header userType="paciente" />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">Buscar Médicos</h1>
          
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Especialidade, nome do médico..."
                value={filters.especialidade}
                onChange={(e) => setFilters({ ...filters, especialidade: e.target.value })}
                className="pl-12 h-14 bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
              />
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 px-4 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)] relative"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient text-[hsl(222,47%,12%)] text-xs font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[400px] bg-[hsl(222,47%,12%)] border-l border-[hsl(222,20%,25%)] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center justify-between">
                    Filtros
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[hsl(45,80%,47%)] hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Specialty Filter */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Especialidade</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {especialidadesMock.map((esp) => (
                        <div key={esp} className="flex items-center gap-2">
                          <Checkbox
                            id={`esp-${esp}`}
                            checked={filters.especialidade === esp}
                            onCheckedChange={() => 
                              setFilters({ ...filters, especialidade: filters.especialidade === esp ? '' : esp })
                            }
                          />
                          <Label htmlFor={`esp-${esp}`} className="text-sm text-gray-400 cursor-pointer">
                            {esp}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Plan Filter */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Plano de Saúde</Label>
                    <div className="space-y-2">
                      {planosSaude.filter(p => p.nome !== 'Particular').map((plano) => (
                        <div key={plano.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`plano-${plano.id}`}
                            checked={filters.planoSaude === plano.nome}
                            onCheckedChange={() => 
                              setFilters({ ...filters, planoSaude: filters.planoSaude === plano.nome ? '' : plano.nome })
                            }
                          />
                          <Label htmlFor={`plano-${plano.id}`} className="text-sm text-gray-400 cursor-pointer">
                            {plano.nome}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">
                      Valor máximo: R$ {filters.valorMaximo}
                    </Label>
                    <Slider
                      value={[filters.valorMaximo]}
                      onValueChange={(value) => setFilters({ ...filters, valorMaximo: value[0] })}
                      max={1000}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Avaliação mínima</Label>
                    <div className="flex gap-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilters({ ...filters, avaliacaoMinima: filters.avaliacaoMinima === rating ? 0 : rating })}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                            filters.avaliacaoMinima === rating
                              ? 'border-[hsl(45,80%,47%)] bg-[hsl(45,80%,47%)]/10'
                              : 'border-[hsl(222,20%,25%)] hover:border-[hsl(45,80%,47%)]/50'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${filters.avaliacaoMinima === rating ? 'fill-[hsl(45,80%,47%)] text-[hsl(45,80%,47%)]' : 'text-gray-500'}`} />
                          <span className={`text-sm ${filters.avaliacaoMinima === rating ? 'text-[hsl(45,80%,47%)]' : 'text-gray-400'}`}>
                            {rating}+
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured Only */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="destaque"
                      checked={filters.apenasDestaque}
                      onCheckedChange={(checked) => 
                        setFilters({ ...filters, apenasDestaque: checked as boolean })
                      }
                    />
                    <Label htmlFor="destaque" className="text-gray-400 cursor-pointer">
                      Apenas médicos em destaque
                    </Label>
                  </div>

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

                  <Button
                    onClick={() => {
                      handleSearch();
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
            <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-400 flex-1">
                Ative a localização para encontrar médicos próximos a você
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

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.especialidade && (
                <Badge variant="secondary" className="bg-[hsl(222,35%,20%)] text-gray-300">
                  {filters.especialidade}
                  <button onClick={() => setFilters({ ...filters, especialidade: '' })}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </Badge>
              )}
              {filters.planoSaude && (
                <Badge variant="secondary" className="bg-[hsl(222,35%,20%)] text-gray-300">
                  {filters.planoSaude}
                  <button onClick={() => setFilters({ ...filters, planoSaude: '' })}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </Badge>
              )}
              {filters.valorMaximo !== 500 && (
                <Badge variant="secondary" className="bg-[hsl(222,35%,20%)] text-gray-300">
                  Até R$ {filters.valorMaximo}
                  <button onClick={() => setFilters({ ...filters, valorMaximo: 500 })}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {isLoading ? 'Buscando...' : `${doctors.length} médicos encontrados`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Ordenar por:</span>
              <button className="flex items-center gap-1 text-sm text-white">
                Relevância
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-[hsl(222,35%,20%)] animate-pulse" />
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
          ) : doctors.length > 0 ? (
            <div className="space-y-4">
              {(doctors as any[]).map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  distance={(doctor as any).distance}
                  onSchedule={() => {
                    window.location.href = `/medicos/${doctor.id}/agendar`;
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum médico encontrado
              </h3>
              <p className="text-gray-400 mb-6">
                Tente ajustar seus filtros ou buscar por outra especialidade
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav activeTab="buscar" />
    </div>
  );
}
