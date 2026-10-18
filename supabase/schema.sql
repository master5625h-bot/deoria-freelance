-- DeoriaFreelance backend (separate project, not BharatTube)
create extension if not exists pgcrypto;

-- ============ TABLES ============
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('job','gig','freelancer')),
  title text not null,
  payload jsonb not null default '{}',
  contact_email text,
  status text not null default 'pending' check (status in ('pending','live','flagged','rejected')),
  flags text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  nick text not null,
  skill text, rate text, city text, about text, samples text,
  updated_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  target text not null,
  stars int not null check (stars between 1 and 5),
  comment text default '',
  nick text default '',
  user_id uuid not null default auth.uid(),
  status text not null default 'pending' check (status in ('pending','live','flagged')),
  flags text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null default auth.uid(),
  sender_nick text default '',
  to_user uuid not null,
  body text not null,
  status text not null default 'live' check (status in ('live','flagged')),
  flags text[] default '{}',
  created_at timestamptz not null default now()
);

-- ============ SCREENING ============
create or replace function public.screen_text(t text) returns text[] language plpgsql immutable as $$
declare flags text[] := '{}'; x text := lower(coalesce(t,''));
begin
  if x ~ '\+?\d[\d \-]{8,}\d' then flags := flags || 'phone'; end if;
  if x ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' then flags := flags || 'email'; end if;
  if x ~ '(https?://|www\.)' then flags := flags || 'link'; end if;
  if x ~ '(registration fee|joining fee|security deposit|advance fee|pay first|paisa pehle|pehle paisa|guaranteed income|earning guarantee|crypto|usdt|investment plan|telegram)' then flags := flags || 'scam'; end if;
  if x ~ '(chutiya|madarchod|bhenchod|behenchod|harami|randi|fuck|fucking|bitch|\bbc\b|\bmc\b)' then flags := flags || 'abuse'; end if;
  return flags;
end $$;

create or replace function public.screen_submission() returns trigger language plpgsql security definer set search_path = public as $$
declare f text[] := '{}'; txt text;
begin
  txt := coalesce(new.title,'') || ' ' || coalesce(new.payload->>'desc','') || ' ' || coalesce(new.payload->>'about','') || ' ' || coalesce(new.payload->>'samples','') || ' ' || coalesce(new.payload->>'nick','') || ' ' || coalesce(new.payload->>'city','') || ' ' || coalesce(new.payload->>'db','') || ' ' || coalesce(new.payload->>'ps','') || ' ' || coalesce(new.payload->>'pp','');
  f := public.screen_text(txt);
  -- contact info allowed only in the private contact field; phone/email/link in public text is flagged
  if (select count(*) from public.submissions s where s.contact_email = new.contact_email and s.created_at > now() - interval '1 hour') >= 5 then
    f := f || 'rate-limit';
  end if;
  if array_length(f,1) > 0 then
    new.status := 'flagged'; new.flags := f;
  else
    new.status := 'live'; new.flags := '{}';
  end if;
  return new;
end $$;

drop trigger if exists trg_screen_submission on public.submissions;
create trigger trg_screen_submission before insert on public.submissions for each row execute function public.screen_submission();

create or replace function public.screen_rating() returns trigger language plpgsql security definer set search_path = public as $$
declare f text[] := '{}';
begin
  f := public.screen_text(coalesce(new.comment,'') || ' ' || coalesce(new.nick,''));
  if array_length(f,1) > 0 then new.status := 'flagged'; new.flags := f;
  else new.status := 'live'; new.flags := '{}'; end if;
  return new;
end $$;
drop trigger if exists trg_screen_rating on public.ratings;
create trigger trg_screen_rating before insert on public.ratings for each row execute function public.screen_rating();

create or replace function public.screen_message() returns trigger language plpgsql security definer set search_path = public as $$
declare f text[] := '{}';
begin
  -- private messages: abuse/scam screened, contact sharing allowed
  f := public.screen_text(new.body) & array['scam','abuse'];
  if array_length(f,1) > 0 then new.status := 'flagged'; new.flags := f;
  else new.status := 'live'; new.flags := '{}'; end if;
  return new;
end $$;
drop trigger if exists trg_screen_message on public.messages;
create trigger trg_screen_message before insert on public.messages for each row execute function public.screen_message();

-- ============ PUBLIC VIEW (no private data) ============
create or replace view public.public_listings as
select id, type, title,
  payload - 'contact' - 'phone' - 'email' - 'whatsapp' - 'contact_email' as payload,
  created_at
from public.submissions
where status = 'live';

-- ============ RLS ============
alter table public.submissions enable row level security;
alter table public.profiles enable row level security;
alter table public.ratings enable row level security;
alter table public.messages enable row level security;

-- submissions: anyone can submit (trigger forces screening); only owner reads/updates
create policy sub_insert on public.submissions for insert to anon, authenticated with check (true);
create policy sub_owner_read on public.submissions for select to authenticated using ((auth.jwt()->>'email') = 'dheerajhj42@gmail.com');
create policy sub_owner_update on public.submissions for update to authenticated using ((auth.jwt()->>'email') = 'dheerajhj42@gmail.com') with check ((auth.jwt()->>'email') = 'dheerajhj42@gmail.com');

-- profiles: public read, owner write
create policy prof_read on public.profiles for select to anon, authenticated using (true);
create policy prof_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy prof_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ratings: public read of live; logged-in write
create policy rate_read on public.ratings for select to anon, authenticated using (status = 'live' or user_id = auth.uid() or (auth.jwt()->>'email') = 'dheerajhj42@gmail.com');
create policy rate_insert on public.ratings for insert to authenticated with check (user_id = auth.uid());
create policy rate_owner_update on public.ratings for update to authenticated using ((auth.jwt()->>'email') = 'dheerajhj42@gmail.com');

-- messages: sender + recipient only
create policy msg_insert on public.messages for insert to authenticated with check (sender = auth.uid());
create policy msg_read on public.messages for select to authenticated using (status = 'live' and (sender = auth.uid() or to_user = auth.uid()));

-- grants
grant select on public.public_listings to anon, authenticated;
