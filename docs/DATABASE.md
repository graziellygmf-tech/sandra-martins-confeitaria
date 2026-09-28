# Database

## 1. Objetivo

O banco deve representar as informações necessárias para o MVP sem transformar o projeto em um sistema empresarial complexo. O modelo deve ser relacional, orientado a domínio e preparado para evolução.

## 2. Entidades iniciais

~~~text
profiles
categories
creations
creation_images
availability_days
quote_requests
~~~

Relacionamentos principais: `categories` 1:N `creations`; `creations` 1:N `creation_images`; `creations` 1:N `quote_requests`.

## 3. profiles

Representa usuários administrativos.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK / referência ao usuário autenticado |
| name | text | obrigatório |
| role | text | obrigatório |
| created_at | timestamptz | obrigatório |

Papel inicial: `admin`.

## 4. categories

Categorias utilizadas na galeria.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK |
| name | text | obrigatório |
| slug | text | obrigatório / único |
| description | text | opcional |
| cover_image | text | opcional |
| position | integer | obrigatório |
| is_active | boolean | obrigatório |
| created_at | timestamptz | obrigatório |

Exemplos: Bolos, Doces, Personalizados e Datas especiais.

## 5. creations

Representa cada trabalho exibido na galeria.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK |
| title | text | obrigatório |
| slug | text | obrigatório / único |
| description | text | opcional |
| category_id | uuid | FK |
| featured | boolean | obrigatório |
| is_published | boolean | obrigatório |
| position | integer | obrigatório |
| created_at | timestamptz | obrigatório |
| updated_at | timestamptz | obrigatório |

A criação não deve armazenar múltiplas imagens em colunas fixas.

## 6. creation_images

Permite várias imagens por criação.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK |
| creation_id | uuid | FK / obrigatório |
| storage_path | text | obrigatório |
| alt_text | text | opcional |
| position | integer | obrigatório |
| is_cover | boolean | obrigatório |
| created_at | timestamptz | obrigatório |

## 7. availability_days

Representa o estado operacional de cada data.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK |
| date | date | obrigatório / único |
| status | text | obrigatório |
| capacity | integer | opcional |
| notes | text | opcional |
| created_at | timestamptz | obrigatório |
| updated_at | timestamptz | obrigatório |

Status iniciais: `AVAILABLE`, `LIMITED`, `BLOCKED`.

A capacidade é armazenada desde o início para permitir evolução de disponibilidade simples para capacidade operacional.

## 8. quote_requests

Representa uma intenção de orçamento, não necessariamente um pedido confirmado.

| Campo | Tipo | Regra |
|---|---|---|
| id | uuid | PK |
| requested_date | date | obrigatório |
| creation_id | uuid | FK / opcional |
| customer_name | text | obrigatório |
| customer_phone | text | obrigatório |
| guest_count | integer | opcional |
| message | text | opcional |
| source | text | obrigatório |
| status | text | obrigatório |
| created_at | timestamptz | obrigatório |

Status iniciais: `NEW`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `CANCELLED`.

## 9. Integridade

- `categories.slug` deve ser único;
- `creations.slug` deve ser único;
- `availability_days.date` deve ser único;
- uma criação pertence a uma categoria;
- uma criação pode possuir várias imagens;
- uma solicitação pode referenciar uma criação;
- exclusões devem considerar dependências.

## 10. Publicação

Para conteúdo público, preferir estados explícitos em vez de apagar imediatamente. Exemplo: `is_published = false`.

## 11. Segurança

As tabelas devem usar PostgreSQL Row Level Security.

### Público

Pode ler somente conteúdo explicitamente publicado e dados de disponibilidade destinados ao cliente.

### Administrador

Pode criar, editar e remover dados administrativos de acordo com suas permissões.

### Cliente

Não recebe acesso direto às tabelas administrativas.

## 12. Storage

As imagens ficam no Supabase Storage. O banco armazena o caminho do arquivo em `creation_images.storage_path`. O arquivo físico não fica no PostgreSQL nem no GitHub.

## 13. Índices iniciais

Considerar índices para: `categories.slug`, `creations.slug`, `creations.category_id`, `creations.is_published`, `availability_days.date`, `quote_requests.requested_date` e `quote_requests.status`.

Não criar índices indiscriminadamente. Cada índice deve ter uma justificativa de consulta.

## 14. Evolução futura

Entidades possíveis, somente quando houver necessidade: `customers`, `orders`, `testimonials`, `site_settings`, `content_sections` e `production_tasks`.

## 15. Regra principal

O banco deve representar **estado do negócio**, não detalhes da interface. Por exemplo, o banco deve guardar `status = LIMITED` e `capacity = 3`, e não uma cor de card do calendário.
