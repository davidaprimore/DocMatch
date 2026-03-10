import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas protegidas por perfil
const PACIENTE_ROUTES = ['/dashboard', '/agendar', '/buscar', '/receitas', '/comparar-precos', '/planos', '/perfil', '/consultas', '/favoritos', '/notificacoes', '/configuracoes']
const PROFISSIONAL_ROUTES = ['/profissional']
const FARMACIA_ROUTES = ['/farmacia']
const ADMIN_ROUTES = ['/admin']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // TODO: Substituir por verificação real do Supabase SSR
    // const supabase = createServerClient(...)
    // const { data: { session } } = await supabase.auth.getSession()
    // if (!session && isProtected(pathname)) redirect('/login')

    // Por enquanto: sem bloqueio (auth via client-side + mock)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$).*)',
    ],
}
