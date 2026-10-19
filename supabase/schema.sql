-- Sticky Ticky initial schema. Review and apply in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  image_url text,
  is_active boolean not null default false,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  label_en text not null,
  label_ar text not null,
  price numeric(10,2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_name text not null,
  phone text not null,
  delivery_address text not null,
  language text not null default 'en' check (language in ('en', 'ar')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled')),
  subtotal numeric(10,2),
  shipping_fee numeric(10,2),
  total numeric(10,2),
  payment_method text,
  payment_status text not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_en text not null,
  product_name_ar text not null,
  variant_label_en text not null,
  variant_label_ar text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2),
  created_at timestamptz not null default now()
);

-- Public visitors may read active, non-demo catalog content.
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public can view active categories"
on public.categories for select using (is_active = true);

create policy "Public can view active non-demo products"
on public.products for select using (is_active = true and is_demo = false);

create policy "Public can view active variants"
on public.product_variants for select using (
  is_active = true and exists (
    select 1 from public.products p
    where p.id = product_variants.product_id and p.is_active = true and p.is_demo = false
  )
);

-- IMPORTANT:
-- Do not add public insert policies to orders/order_items or expose a service-role key.
-- Production checkout should call a server-side API/Edge Function that validates prices,
-- stock, quantities, and customer input before writing order records.
-- Admin CRUD requires authenticated admin identities and restrictive policies.
