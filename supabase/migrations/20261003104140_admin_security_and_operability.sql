-- The public calendar needs only dates and status. Keep capacity and notes
-- available to admins, but out of reach from the public Data API.
drop policy if exists "Public can read availability" on public.availability_days;

create view public.availability_calendar
with (security_barrier = true)
as
select date, status
from public.availability_days;

comment on view public.availability_calendar is
  'Public calendar data only. Capacity and private admin notes are intentionally excluded.';

-- Make API grants explicit. RLS policies below still decide which rows can be
-- read or changed by each role.
revoke all on table public.profiles, public.categories, public.creations,
  public.creation_images, public.availability_days, public.quote_requests
  from public, anon, authenticated;

grant select on table public.categories, public.creations, public.creation_images
  to anon, authenticated;
grant select, insert, update, delete on table public.categories, public.creations,
  public.creation_images to authenticated;
grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table public.availability_days to authenticated;
grant select on table public.availability_calendar to anon, authenticated;
grant insert on table public.quote_requests to anon;
grant select, insert, update, delete on table public.quote_requests to authenticated;

-- Explicitly limit public content and combine public/admin reads per role so
-- authenticated requests do not evaluate overlapping policies for every row.
drop policy if exists "Authenticated admins can read profiles" on public.profiles;
create policy "Authenticated users can read their profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Authenticated admins can manage categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select to anon
using (is_active = true);
create policy "Signed-in users can read active categories and admins can read all"
on public.categories for select to authenticated
using (
  is_active = true
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);
create policy "Admins can create categories"
on public.categories for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can update categories"
on public.categories for update to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can delete categories"
on public.categories for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "Public can read published creations" on public.creations;
drop policy if exists "Authenticated admins can manage creations" on public.creations;
create policy "Public can read published creations"
on public.creations for select to anon
using (is_published = true);
create policy "Signed-in users can read published creations and admins can read all"
on public.creations for select to authenticated
using (
  is_published = true
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);
create policy "Admins can create creations"
on public.creations for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can update creations"
on public.creations for update to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can delete creations"
on public.creations for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "Public can read images of published creations" on public.creation_images;
drop policy if exists "Authenticated admins can manage creation images" on public.creation_images;
create policy "Public can read images of published creations"
on public.creation_images for select to anon
using (
  exists (select 1 from public.creations c where c.id = creation_images.creation_id and c.is_published = true)
);
create policy "Signed-in users can read published images and admins can read all"
on public.creation_images for select to authenticated
using (
  exists (
    select 1 from public.creations c
    where c.id = creation_images.creation_id
      and (c.is_published = true or exists (
        select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'
      ))
  )
);
create policy "Admins can add creation images"
on public.creation_images for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can update creation images"
on public.creation_images for update to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can delete creation images"
on public.creation_images for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "Authenticated admins can manage availability" on public.availability_days;
create policy "Authenticated admins can manage availability"
on public.availability_days for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "Public can create quote requests" on public.quote_requests;
drop policy if exists "Authenticated admins can manage quote requests" on public.quote_requests;
create policy "Public can create quote requests"
on public.quote_requests for insert to anon
with check (source = 'website');
create policy "Signed-in users can create website requests and admins can create requests"
on public.quote_requests for insert to authenticated
with check (
  source = 'website'
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);
create policy "Admins can read quote requests"
on public.quote_requests for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can update quote requests"
on public.quote_requests for update to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can delete quote requests"
on public.quote_requests for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- Preserve the invariant that there can be at most one cover per creation.
create unique index if not exists creation_images_single_cover_idx
  on public.creation_images (creation_id)
  where is_cover = true;
create index if not exists creation_images_creation_id_idx on public.creation_images (creation_id);
create index if not exists quote_requests_creation_id_idx on public.quote_requests (creation_id);

-- Resolve the mutable search_path warning without changing trigger behavior.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

