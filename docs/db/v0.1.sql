-- 다이어리 엔트리 테이블
create table public.diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  weather text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 태그 테이블
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique
);

-- 다이어리 엔트리와 태그의 다대다 관계를 위한 연결 테이블
create table public.entry_tags (
  entry_id uuid references public.diary_entries not null,
  tag_id uuid references public.tags not null,
  primary key (entry_id, tag_id)
);

-- RLS (Row Level Security) 정책 설정
alter table public.diary_entries enable row level security;
alter table public.tags enable row level security;
alter table public.entry_tags enable row level security;

-- 사용자는 자신의 다이어리 엔트리만 CRUD 할 수 있음
create policy "Users can perform CRUD on own diary entries" 
on public.diary_entries for all 
using (auth.uid() = user_id);

-- 모든 인증된 사용자가 태그를 볼 수 있음
create policy "Authenticated users can view tags" 
on public.tags for select 
using (auth.role() = 'authenticated');

-- 사용자는 자신의 엔트리에 대한 태그 연결만 CRUD 할 수 있음
create policy "Users can perform CRUD on own entry tags" 
on public.entry_tags for all 
using (auth.uid() = (select user_id from public.diary_entries where id = entry_id));