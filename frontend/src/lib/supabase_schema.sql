-- ============================================================
-- TUITUI CO. — SUPABASE SCHEMA MIGRATION
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id            text primary key,
  name          text not null,
  category      text not null,
  price         text not null,
  price_value   numeric not null,
  discount_price text,
  image         text not null,
  description   text not null,
  colors        text[] not null default '{}',
  sizes         text[] not null default '{}',
  quantity      integer not null default 0,
  stock_status  text not null check (stock_status in ('in-stock', 'out-of-stock', 'low-stock')),
  seller_id     text not null,
  is_featured   boolean default false,
  created_at    timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ROW LEVEL SECURITY
alter table public.products enable row level security;

-- Allow anonymous read access (storefront)
create policy "Allow public read access"
  on public.products
  for select
  using (true);

-- Allow full access for authenticated users (admins + sellers)
create policy "Allow full access for authenticated users"
  on public.products
  for all
  using (auth.role() = 'authenticated');

-- 3. STORAGE BUCKET (run in Supabase Dashboard > Storage > New bucket)
-- Bucket name: showcase
-- Public: true
-- Or via SQL:
insert into storage.buckets (id, name, public)
  values ('showcase', 'showcase', true)
  on conflict (id) do nothing;

-- Allow public read on showcase bucket
create policy "Public read showcase"
  on storage.objects
  for select
  using (bucket_id = 'showcase');

-- Allow authenticated uploads to showcase bucket
create policy "Authenticated upload showcase"
  on storage.objects
  for insert
  with check (bucket_id = 'showcase' and auth.role() = 'authenticated');
