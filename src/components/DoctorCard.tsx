import { Star, MapPin, Clock, CreditCard, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Medico } from '@/types';

interface DoctorCardProps {
  doctor: Medico;
  onSchedule?: () => void;
  distance?: number;
}

export function DoctorCard({ doctor, onSchedule, distance }: DoctorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating)
            ? 'fill-[hsl(45,80%,47%)] text-[hsl(45,80%,47%)]'
            : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <Card className="card-hover bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20 border-2 border-[hsl(222,20%,25%)]">
              <AvatarImage src={doctor.foto_url} alt={doctor.nome} />
              <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white text-lg">
                {doctor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {doctor.destaque && (
              <div className="absolute -top-1 -right-1 w-6 h-6 gold-gradient rounded-full flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-[hsl(222,47%,12%)]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white truncate">{doctor.nome}</h3>
                <p className="text-sm text-[hsl(45,80%,47%)]">{doctor.especialidade}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(doctor.avaliacao)}
              </div>
              <span className="text-xs text-gray-400">
                {doctor.avaliacao.toFixed(1)} ({doctor.total_avaliacoes})
              </span>
            </div>

            {/* CRM */}
            <p className="text-xs text-gray-500 mt-1">{doctor.crm}</p>

            {/* Location */}
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">
                {doctor.endereco_consultorio.bairro}, {doctor.endereco_consultorio.cidade}
              </span>
              {distance && (
                <span className="text-[hsl(45,80%,47%)] ml-1">• {distance.toFixed(1)} km</span>
              )}
            </div>

            {/* Health Plans */}
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="truncate">
                {doctor.planos_saude_aceitos.slice(0, 3).map(p => p.nome).join(', ')}
                {doctor.planos_saude_aceitos.length > 3 && '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[hsl(222,20%,25%)]">
          <div>
            <p className="text-xs text-gray-400">Consulta a partir de</p>
            <p className="text-lg font-bold text-[hsl(45,80%,47%)]">
              R$ {doctor.valor_consulta.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <Button 
            onClick={onSchedule}
            className="gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
          >
            <Clock className="w-4 h-4 mr-2" />
            Agendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
