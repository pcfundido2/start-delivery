# Start Delivery

Site de delivery local para Montividiu/GO.

## 🔑 Antes de publicar — coloque suas chaves do Supabase

Abra o arquivo `src/supabaseClient.js` e troque:

```js
const SUPABASE_URL = "COLE_AQUI_A_SUA_PROJECT_URL";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_SUA_ANON_PUBLIC_KEY";
```

Pelas suas chaves reais, que você encontra no painel do Supabase em
**Settings → API**.

## 🧪 Testar no seu computador antes de publicar (opcional)

Se você tiver o Node.js instalado:

```bash
npm install
npm run dev
```

Isso abre o site em `http://localhost:5173` para você testar antes de publicar.

## 🚀 Publicar de verdade (deixar o site no ar)

A forma mais simples é usando a **Vercel** (gratuita):

1. Crie uma conta em **https://vercel.com** (pode entrar com GitHub)
2. Suba esta pasta para um repositório no GitHub
   - Ou, mais simples: na Vercel, clique em **"Add New Project"** →
     **"Deploy"** e arraste a pasta do projeto direto (Vercel aceita
     upload manual de pastas em alguns fluxos — se não aparecer essa
     opção, use o GitHub)
3. A Vercel detecta automaticamente que é um projeto Vite/React
4. Clique em **Deploy**
5. Em poucos minutos, a Vercel te dá um link tipo
   `https://start-entregas.vercel.app` — esse é o link do seu site
   publicado, funcionando 24 horas por dia

## 📦 Estrutura do projeto

- `src/App.jsx` — todo o site (cliente, empresa, entregador, admin)
- `src/data.js` — funções que conversam com o banco de dados (Supabase)
- `src/supabaseClient.js` — conexão com o banco (suas chaves vão aqui)
- `src/main.jsx` e `src/index.css` — arquivos técnicos de inicialização

## 🔄 Como atualizar o site no futuro

Veja a seção "Como mandar atualizações no futuro" na conversa com o Claude.
Resumindo: você edita os arquivos (ou pede pro Claude editar), sobe a
versão nova no GitHub, e a Vercel publica a atualização automaticamente
em menos de 1 minuto.
