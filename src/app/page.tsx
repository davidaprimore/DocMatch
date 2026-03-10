import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o usuário direto para o Novo Dashboard Premium Deslumbrante, 
  // pulando o arquivo de 2000 linhas gerado pelo GLM com telas e modais quebrados.
  redirect('/dashboard');
}
