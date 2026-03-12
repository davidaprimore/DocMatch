import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'sonner'
import { I18nProvider } from '@/components/I18nProvider'

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
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'DocMatch',
    },
}

export const viewport: Viewport = {
    themeColor: '#2D5284',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

import { ScrollToTop } from '@/components/ScrollToTop'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                {/* Meta tags essenciais para PWA (Android/iOS) para remover barras de navegação */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="DocMatch" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="msapplication-TileColor" content="#2D5284" />
                <meta name="theme-color" content="#2D5284" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                <ScrollToTop />
                <I18nProvider>
                    <AuthProvider>
                        {children}
                        <Toaster position="bottom-center" richColors />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    if ('serviceWorker' in navigator) {
                                        window.addEventListener('load', function() {
                                            navigator.serviceWorker.register('/sw.js').catch(function(err) {
                                                console.log('Erro no ServiceWorker:', err);
                                            });
                                        });
                                    }
                                `,
                            }}
                        />
                    </AuthProvider>
                </I18nProvider>
            </body>
        </html>
    )
}
