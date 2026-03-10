import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: {
        default: 'DocMatch — Encontre o Médico Ideal',
        template: '%s | DocMatch',
    },
    description: 'Encontre médicos, agende consultas e compare preços de medicamentos. A plataforma de saúde mais completa do Brasil.',
    keywords: ['médico', 'consulta médica', 'agendamento médico', 'receita digital', 'farmácia', 'saúde'],
    authors: [{ name: 'DocMatch' }],
    creator: 'DocMatch',
    metadataBase: new URL('https://docmatch.com.br'),
    openGraph: {
        title: 'DocMatch — Encontre o Médico Ideal',
        description: 'Encontre médicos, agende consultas e compare preços de medicamentos.',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'DocMatch',
    },
}

export const viewport: Viewport = {
    themeColor: '#2D5284',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body className="antialiased">
                <AuthProvider>
                    {children}
                    <Toaster position="bottom-center" richColors />
                </AuthProvider>
            </body>
        </html>
    )
}
