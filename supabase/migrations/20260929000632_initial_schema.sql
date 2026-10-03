create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.creations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  featured boolean not null default false,
  is_published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creation_images (
  id uuid primary key default gen_random_uuid(),
  creation_id uuid not null references public.creations(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.availability_days (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  status text not null check (status in ('AVAILABLE', 'LIMITED', 'BLOCKED')),
  capacity integer check (capacity is null or capacity >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  requested_date date not null,
  creation_id uuid references public.creations(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  guest_count integer check (guest_count is null or guest_count > 0),
  message text,
  source text not null default 'website',
  status text not null default 'NEW'
    check (status in ('NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'CANCELLED')),
  created_at timestamptz not null default now()
);

create index creations_category_id_idx on public.creations(category_id);
create index creations_published_idx on public.creations(is_published);
create index availability_days_date_idx on public.availability_days(date);
create index quote_requests_requested_date_idx on public.quote_requests(requested_date);
create index quote_requests_status_idx on public.quote_requests(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger creations_set_updated_at
before update on public.creations
for each row execute function public.set_updated_at();

create trigger availability_days_set_updated_at
before update on public.availability_days
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.creations enable row level security;
alter table public.creation_images enable row level security;
alter table public.availability_days enable row level security;
alter table public.quote_requests enable row level security;

create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true);

create policy "Public can read published creations"
on public.creations for select
to anon, authenticated
using (is_published = true);

create policy "Public can read images of published creations"
on public.creation_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.creations c
    where c.id = creation_images.creation_id
      and c.is_published = true
  )
);

create policy "Public can read availability"
on public.availability_days for select
to anon, authenticated
using (true);

create policy "Authenticated admins can read profiles"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Authenticated admins can manage categories"
on public.categories for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Authenticated admins can manage creations"
on public.creations for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Authenticated admins can manage creation images"
on public.creation_images for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Authenticated admins can manage availability"
on public.availability_days for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Public can create quote requests"
on public.quote_requests for insert
to anon, authenticated
with check (source = 'website');

create policy "Authenticated admins can manage quote requests"
on public.quote_requests for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

