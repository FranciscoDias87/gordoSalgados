# Landing Page - Gordo Salgados

Uma landing page moderna para a empresa Gordo Salgados com painel administrativo completo para gerenciamento de produtos.

## 🚀 Funcionalidades

### Landing Page
- Design responsivo e moderno
- Seções: Hero, Cardápio, Depoimentos, Contato
- Integração com WhatsApp
- Otimizado para SEO

### Painel Administrativo
- **Dashboard**: Estatísticas e visão geral
- **Gerenciamento de Produtos**: CRUD completo (Criar, Ler, Atualizar, Excluir)
- **Autenticação**: Login seguro para acesso admin
- **Interface Intuitiva**: Formulários modais e tabelas responsivas

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Supabase** - Banco de dados e autenticação
- **Shadcn/ui** - Componentes UI
- **Lucide Icons** - Ícones
- **Zod** - Validação de esquemas
- **React Query** - Gerenciamento de estado e cache
- **Sentry** - Monitoramento de erros

## 📋 Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/FranciscoDias87/LP_Gordo_Salgados.git
cd LP_Gordo_Salgados
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### a. Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL do projeto e a chave anônima

#### b. Configure o banco de dados
1. No painel do Supabase, vá para "SQL Editor"
2. Execute o conteúdo do arquivo `supabase-setup.sql`
3. Isso criará a tabela `products` com dados iniciais

#### c. Configure as variáveis de ambiente
1. Copie o arquivo `.env.local` (já criado)
2. Substitua os valores:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua-chave-publica-aqui
```

### 4. Execute o projeto
```bash
npm run dev
```

### 5. Acesse o painel admin
- **Landing Page**: http://localhost:3000
- **Login Admin**: http://localhost:3000/admin/login
- **Credenciais**: Configuradas via banco de dados (Autenticação segura)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Landing page principal
│   ├── admin/
│   │   ├── page.tsx          # Dashboard admin
│   │   ├── layout.tsx        # Layout do painel admin
│   │   ├── login/page.tsx    # Página de login
│   │   └── products/page.tsx # Gerenciamento de produtos
├── components/
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── admin/                # Componentes específicos do admin
│   └── ...                   # Outros componentes
├── lib/
│   ├── supabase.ts           # Cliente e serviços do Supabase
│   ├── mock-data.ts          # Dados mock (fallback)
│   └── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🔒 Segurança

- **Autenticação**: Sistema robusto com JWT e Cookies HttpOnly
- **Row Level Security**: Configurado no Supabase
- **Variáveis de Ambiente**: Chaves sensíveis protegidas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Opções
- Netlify
- Railway
- Self-hosted

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato:
- Email: franciscocpddias@hotmail.com
- GitHub: [FranciscoDias87](https://github.com/FranciscoDias87)

---

**Desenvolvido para Gordo Salgados**
