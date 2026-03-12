import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Entrar',
    description: 'Faça login na sua conta DocMatch',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
