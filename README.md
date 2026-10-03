# Sandra Martins Confeitaria

Plataforma digital da Sandra Martins Confeitaria: uma experiência mobile-first para apresentar criações sob encomenda, consultar disponibilidade e transformar interesse em solicitações de orçamento via WhatsApp.

## Objetivo

O projeto não é um e-commerce tradicional. É uma plataforma composta por:
- **Site público** — descoberta, galeria, criações, disponibilidade e orçamento.
- **Painel administrativo** — calendário, galeria, criações e solicitações.
- **Backend** — dados, autenticação e armazenamento de imagens.

## Tecnologias
- Next.js + React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth e Storage)
- Vercel
- GitHub

## MVP
### Site público
- Home
- Galeria
- Página individual de criação
- Disponibilidade
- Como funciona
- Sobre
- FAQ
- CTA para orçamento via WhatsApp

### Administração
- Login
- Dashboard
- Gerenciamento da galeria
- Gerenciamento de criações
- Gerenciamento do calendário

## Princípios
1. **Mobile-first:** a experiência principal começa no celular.
2. **Fotografia-first:** o trabalho da confeitaria é o protagonista visual.
3. **Conteúdo orientado a dados:** criações, categorias, disponibilidade e conteúdo editável não ficam hardcoded no frontend.
4. **Monólito modular:** uma aplicação inicialmente simples, organizada por domínios, sem microserviços prematuros.
5. **Administração simples:** o painel deve reduzir o trabalho da Sandra, não exigir conhecimento técnico.
6. **WhatsApp como fechamento:** o site organiza a decisão e o WhatsApp continua sendo o canal inicial de orçamento.
7. **Escalabilidade pragmática:** a arquitetura deve permitir evolução sem construir complexidade antes da necessidade.

## Documentação
- [Arquitetura](docs/ARCHITECTURE.md)
- [Banco de dados](docs/DATABASE.md)

## Status atual

O MVP está implementado: site público com galeria, páginas de criações, agenda de disponibilidade e contato por WhatsApp; painel administrativo autenticado para criações, categorias, agenda e solicitações registradas. As imagens ficam no Supabase Storage e os dados no PostgreSQL.

O projeto continua em evolução. Alterações de banco devem ser feitas por migrations em `supabase/migrations/`; não aplique uma migration em produção sem revisar e validar a mudança.

