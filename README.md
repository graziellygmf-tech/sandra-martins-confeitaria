# Sandra Martins Confeitaria

Plataforma digital da Sandra Martins Confeitaria: uma experiência mobile-first para apresentar criações sob encomenda, consultar disponibilidade e transformar interesse em solicitações de orçamento via WhatsApp.

## Objetivo

O projeto não é um e-commerce tradicional. É uma plataforma composta por:
- **Site público** — descoberta, galeria, criações, disponibilidade e orçamento.
- **Painel administrativo** — calendário, galeria, criações e solicitações.
- **Backend** — dados, autenticação e armazenamento de imagens.

## Stack planejada
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

## Status
**Fase:** especificação técnica inicial.

O repositório está sendo estruturado antes da implementação do produto para manter arquitetura, banco e experiência coerentes desde o primeiro ciclo de desenvolvimento.