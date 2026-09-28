# Architecture

## 1. Visão geral
A Sandra Martins Confeitaria será implementada inicialmente como um **monólito modular**:
~~~text
Cliente
  ├── Site público
  └── Painel administrativo
          │
          ▼
      Next.js
          │
          ▼
       Supabase
      ┌───┼────┐
      ▼   ▼    ▼
   Postgres Auth Storage
~~~
O objetivo é manter uma única aplicação fácil de desenvolver, testar e implantar, mas com separação clara entre domínios. Microserviços não fazem parte do MVP.

## 2. Stack
### Aplicação
- Next.js
- React
- TypeScript
- Tailwind CSS
### Dados e backend
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
### Infraestrutura
- GitHub
- Vercel
### Integração comercial
- WhatsApp via link estruturado no MVP

## 3. Estrutura de diretórios
~~~text
app/
├── (site)/
│   ├── page.tsx
│   ├── galeria/
│   ├── criacao/
│   ├── disponibilidade/
│   ├── como-funciona/
│   ├── sobre/
│   └── faq/
├── admin/
│   ├── page.tsx
│   ├── calendario/
│   ├── galeria/
│   ├── criacoes/
│   ├── pedidos/
│   └── configuracoes/
├── login/
├── layout.tsx
└── globals.css

components/
├── ui/
├── site/
├── gallery/
├── calendar/
└── admin/

lib/
├── supabase/
├── availability/
├── whatsapp/
└── utils/

types/

supabase/
├── migrations/
└── seed.sql

tests/
~~~
A estrutura pode evoluir, mas novos módulos devem seguir os domínios do produto em vez de criar pastas genéricas sem responsabilidade clara.

## 4. Domínios
### Gallery
Responsável por categorias, criações, imagens, publicação, ordem de exibição e destaques.
### Availability
Responsável por datas, status de disponibilidade, capacidade, bloqueios e observações.
### Quotes
Responsável por solicitações de orçamento, dados básicos do cliente, data desejada, criação de referência e status.
### Content
Responsável por conteúdo editável do site, como FAQ, informações institucionais e configurações de conteúdo.
### Admin
Responsável pela experiência autenticada da Sandra.
### Analytics
Será introduzido depois do MVP e não deve contaminar a lógica principal do produto.

## 5. Fluxo público
~~~text
Home → Galeria → Criação → Disponibilidade → Solicitação de orçamento → WhatsApp
~~~
O site deve ajudar o visitante a descobrir o trabalho, encontrar uma referência, verificar a data, fornecer contexto e iniciar a conversa com a Sandra.

## 6. Fluxo administrativo
~~~text
Login → Dashboard → Calendário / Galeria / Criações / Solicitações
~~~
A interface administrativa deve privilegiar tarefas frequentes e rápidas.

## 7. Regra de fonte da verdade
Dados de negócio não devem ser hardcoded na interface. Disponibilidade, criações, categorias, imagens e conteúdo editável devem vir da camada de dados.

## 8. Segurança
O painel administrativo exige autenticação.
- Supabase Auth para identidade;
- PostgreSQL Row Level Security para proteção dos dados;
- rotas administrativas protegidas;
- segredos somente em variáveis de ambiente;
- `.env.local` nunca versionado.
A segurança não deve depender apenas de esconder páginas no frontend.

## 9. Imagens
Fotos não serão armazenadas no Git. O código fica no GitHub; as imagens ficam no Supabase Storage.

## 10. SEO e performance
- URLs semânticas;
- metadata por página;
- Open Graph;
- sitemap;
- robots;
- alt text;
- imagens otimizadas;
- renderização adequada para conteúdo público;
- mobile-first.
Exemplo: `/criacoes/bolo-floral-delicado` em vez de `/produto/123`.

## 11. WhatsApp
O MVP não depende da API oficial do WhatsApp. O sistema deve gerar uma mensagem estruturada com data desejada, criação escolhida, quantidade de pessoas e mensagem adicional.

## 12. Evolução
### V1
- Galeria
- Criações
- Calendário
- WhatsApp
- Admin básico
### V2
- Solicitações registradas
- Depoimentos
- FAQ editável
- Conteúdo da Home
- Analytics
### V3
- Capacidade por tipo de serviço
- Clientes
- Histórico
- Recursos de CRM
### V4
Somente se houver necessidade real: automações, gestão de produção, marketing, integrações externas e processos financeiros.

## 13. Fora do MVP
- checkout;
- pagamento online;
- carrinho;
- aplicativo nativo;
- CRM completo;
- estoque;
- gestão financeira;
- IA para precificação;
- integração completa com Instagram.

## 14. Git
Fluxo simples:
~~~text
main
  ↑
feature/nome-da-feature
~~~
Commits devem descrever mudanças reais, como `feat: add gallery` e `feat: add availability calendar`.

## 15. Critério arquitetural
Antes de adicionar uma tecnologia ou serviço, responder:
1. Qual problema concreto ele resolve?
2. O MVP realmente precisa dele?
3. Ele aumenta ou reduz a complexidade operacional?
4. A funcionalidade pode ser implementada dentro dos módulos existentes?
5. Existe uma migração simples caso a solução precise mudar?

A arquitetura deve crescer como o negócio, não antes dele.