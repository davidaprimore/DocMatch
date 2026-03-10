import { useState } from 'react';
import { 
  FileText, 
  QrCode, 
  Download, 
  Printer, 
  Share2, 
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { receitaMock, medicosMock, pacienteMock } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PrescriptionPage() {
  const receita = receitaMock;
  const medico = medicosMock.find(m => m.id === receita.medico_id);
  const paciente = pacienteMock;
  const [showQR, setShowQR] = useState(false);

  const handleDownload = () => {
    toast.success('Receita baixada com sucesso!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast.success('Link da receita copiado!');
  };

  const handleEmail = () => {
    toast.success('Receita enviada para seu email!');
  };

  const handleComparePrices = () => {
    const medicamentosIds = receita.medicamentos.map(m => m.id);
    window.location.href = `/comparar-precos?medicamentos=${medicamentosIds.join(',')}`;
  };

  const isExpired = new Date(receita.validade) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(receita.validade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] pb-24">
      <Header userType="paciente" userName={paciente.nome} />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-400 hover:text-white -ml-4"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Prescription Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <FileText className="w-6 h-6 text-[hsl(222,47%,12%)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Receita Digital</h1>
              <p className="text-gray-400">#{receita.id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {isExpired ? (
            <Badge className="px-4 py-2 bg-red-500/20 text-red-400 border-red-500/30">
              <AlertCircle className="w-4 h-4 mr-2" />
              Receita vencida
            </Badge>
          ) : daysUntilExpiry <= 7 ? (
            <Badge className="px-4 py-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Clock className="w-4 h-4 mr-2" />
              Vence em {daysUntilExpiry} dias
            </Badge>
          ) : (
            <Badge className="px-4 py-2 bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Válida até {new Date(receita.validade).toLocaleDateString('pt-BR')}
            </Badge>
          )}
        </div>

        {/* Digital Prescription Card */}
        <Card className="mb-6 bg-white text-gray-900 border-0 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(222,47%,18%)] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                  </div>
                  <span className="text-xl font-bold text-[hsl(222,47%,18%)]">
                    Doc<span className="text-[hsl(45,80%,47%)]">Match</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">Receituário Digital</p>
              </div>
              <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <QrCode className="w-8 h-8 text-gray-700" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-center text-gray-900">QR Code da Receita</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-6">
                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                      <QrCode className="w-40 h-40 text-gray-800" />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Apresente este QR code na farmácia para validação
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Doctor Info */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Médico Prescritor</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={medico?.foto_url} />
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {medico?.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{medico?.nome}</p>
                  <p className="text-sm text-gray-600">{medico?.especialidade}</p>
                  <p className="text-xs text-gray-500">{medico?.crm}</p>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Paciente</p>
              <p className="font-semibold text-gray-900">{paciente.nome}</p>
              <p className="text-sm text-gray-600">CPF: {paciente.cpf}</p>
            </div>

            {/* Date */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Data de Emissão</p>
              <p className="text-gray-900">
                {new Date(receita.data_emissao).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Medicines */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Prescrição</p>
              <div className="space-y-4">
                {receita.medicamentos.map((med, index) => (
                  <div key={med.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(222,47%,18%)] text-white text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{med.nome}</p>
                        <p className="text-sm text-gray-600">{med.principio_ativo} {med.concentracao}</p>
                        <p className="text-sm text-gray-600">{med.forma_farmaceutica}</p>
                        <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Posologia:</span> {med.posologia}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Quantidade:</span> {med.quantidade} unidades
                          </p>
                          {med.uso_continuo && (
                            <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">
                              Uso contínuo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observations */}
            {receita.observacoes && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Observações</p>
                <p className="text-sm text-gray-700 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  {receita.observacoes}
                </p>
              </div>
            )}

            {/* Digital Signature */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Assinatura digital válida</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {receita.assinatura_digital}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="h-auto py-3 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)] flex flex-col items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs">Baixar PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-auto py-3 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)] flex flex-col items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span className="text-xs">Imprimir</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleEmail}
            className="h-auto py-3 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)] flex flex-col items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs">Email</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="h-auto py-3 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)] flex flex-col items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </div>

        {/* Compare Prices CTA */}
        {!isExpired && (
          <Card className="bg-gradient-to-r from-[hsl(45,80%,47%)]/20 to-[hsl(45,80%,35%)]/10 border-[hsl(45,80%,47%)]/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-7 h-7 text-[hsl(222,47%,12%)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Economize nos seus medicamentos
                  </h3>
                  <p className="text-sm text-gray-400">
                    Compare preços em farmácias próximas e encontre a melhor opção.
                  </p>
                </div>
                <Button 
                  onClick={handleComparePrices}
                  className="flex-shrink-0 gold-gradient text-[hsl(222,47%,12%)] font-semibold"
                >
                  Comparar Preços
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav activeTab="menu" />
    </div>
  );
}
