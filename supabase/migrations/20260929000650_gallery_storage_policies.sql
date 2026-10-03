-- Public read access for gallery images.
-- The bucket itself is public so published image URLs can be rendered by the site.
-- Upload/update/delete remains restricted to authenticated admins.

create policy "Public can read gallery objects"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'gallery');

create policy "Authenticated admins can upload gallery objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Authenticated admins can update gallery objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Authenticated admins can delete gallery objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'gallery'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

