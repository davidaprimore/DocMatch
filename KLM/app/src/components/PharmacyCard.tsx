import { MapPin, Truck, Store, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResultadoComparacao } from '@/types';

interface PharmacyCardProps {
  result: ResultadoComparacao;
  rank: number;
  onBuyOnline?: () => void;
  onPickup?: () => void;
}

export function PharmacyCard({ result, rank, onBuyOnline, onPickup }: PharmacyCardProps) {
  const { farmacia, preco_total_cesta, economia_vs_mais_caro, distancia_km, tempo_entrega, medicamentos } = result;

  const isBestPrice = rank === 1;
  const hasAllMedicines = medicamentos.length === 3; // Assuming 3 is the expected count

  return (
    <Card className={`card-hover overflow-hidden ${
      isBestPrice 
        ? 'bg-gradient-to-br from-[hsl(222,35%,15%)] to-[hsl(45,30%,12%)] border-[hsl(45,80%,35%)]' 
        : 'bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]'
    }`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              isBestPrice 
                ? 'gold-gradient text-[hsl(222,47%,12%)]' 
                : 'bg-[hsl(222,35%,25%)] text-gray-300'
            }`}>
              {rank}
            </div>
            
            {/* Pharmacy Info */}
            <div>
              <h3 className="font-semibold text-white">{farmacia.nome}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{distancia_km?.toFixed(1)} km</span>
                {farmacia.horario_funcionamento._24h && (
                  <Badge variant="secondary" className="text-[10px] bg-green-500/20 text-green-400 border-0">
                    24h
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Savings Badge */}
          {economia_vs_mais_caro > 0 && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingDown className="w-3 h-3 mr-1" />
              -R$ {economia_vs_mais_caro.toFixed(2).replace('.', ',')}
            </Badge>
          )}
        </div>

        {/* Medicines List */}
        <div className="mt-4 space-y-2">
          {medicamentos.map((med, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between py-2 px-3 bg-[hsl(222,47%,12%)] rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{med.medicamento.nome}</p>
                <p className="text-xs text-gray-500">{med.medicamento.fabricante}</p>
              </div>
              <div className="text-right">
                {med.medicamento.preco_promocional ? (
                  <>
                    <p className="text-xs text-gray-500 line-through">
                      R$ {med.medicamento.preco.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm font-semibold text-green-400">
                      R$ {med.medicamento.preco_promocional.toFixed(2).replace('.', ',')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-white">
                    R$ {med.preco_unitario.toFixed(2).replace('.', ',')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Missing Medicines Warning */}
        {!hasAllMedicines && (
          <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400">
              Alguns medicamentos não disponíveis nesta farmácia
            </p>
          </div>
        )}

        {/* Total & Actions */}
        <div className="mt-4 pt-4 border-t border-[hsl(222,20%,25%)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">Total da cesta</p>
              <p className={`text-2xl font-bold ${isBestPrice ? 'text-[hsl(45,80%,47%)]' : 'text-white'}`}>
                R$ {preco_total_cesta.toFixed(2).replace('.', ',')}
              </p>
            </div>
            {tempo_entrega && (
              <div className="text-right">
                <p className="text-xs text-gray-400">Entrega</p>
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Truck className="w-4 h-4" />
                  <span>{tempo_entrega}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {farmacia.entrega_online && (
              <Button 
                onClick={onBuyOnline}
                className="flex-1 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
              >
                <Truck className="w-4 h-4 mr-2" />
                Comprar Online
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={onPickup}
              className="flex-1 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
            >
              <Store className="w-4 h-4 mr-2" />
              Retirar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
