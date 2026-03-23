'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function FormMedico() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({ 
        nome: '', email: '', telefone: '', cpf: '',
        crm: '', uf_crm: '', especialidade: '', password: '', confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)

        if (form.password !== form.confirmPassword) {
            toast.error('As senhas não coincidem.')
            setIsSubmitting(false)
            return
        }

        try {
            await register({
                ...form,
                tipo: 'medico' as const,
            })
            toast.success('Doutor(a) cadastrado com sucesso!')
            setTimeout(() => router.push('/medico/dashboard'), 800)
        } catch (err: any) {
            toast.error(err.message || 'Falha no cadastro.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="space-y-3">
                <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome Completo (Dr./Dra.)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                <div className="flex gap-2">
                    <input name="cpf" value={form.cpf} onChange={handleChange} required placeholder="CPF" className="w-[55%] bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
                    <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="Celular" className="w-[45%] bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex gap-2">
                    <input name="crm" value={form.crm} onChange={handleChange} required placeholder="CRM" className="w-[60%] bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
                    <select name="uf_crm" value={form.uf_crm} onChange={handleChange} required className="w-[40%] bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-white/70 appearance-none focus:outline-none focus:border-[#D4AF37]">
                        <option value="" disabled>UF CRM</option><option value="SP">SP</option><option value="RJ">RJ</option><option value="MG">MG</option><option value="RS">RS</option>
                    </select>
                </div>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="E-mail profissional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Crie uma senha forte" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirme a senha" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]" />
            </div>

            <button type="submit" disabled={isLoading || isSubmitting} className="w-full mt-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                {isLoading || isSubmitting ? 'CADASTRANDO...' : 'CRIAR CONTA MÉDICO'}
                <ChevronRight className="w-5 h-5 opacity-50" />
            </button>
        </form>
    )
}
