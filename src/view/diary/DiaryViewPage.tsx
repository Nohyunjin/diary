'ise client';

import { supabase } from '@/lib/supabaseClient';
import formatDate from '@/utils/formDate';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Date = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const BackLink = styled(Link)`
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1.5rem;
  text-decoration: none;

  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function DiaryViewPage({ id }: { id: string }) {
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setDiary(data);
        } else {
          setError('다이어리를 찾을 수 없습니다.');
        }
      } catch (error: any) {
        setError(
          '다이어리를 불러오는 중 오류가 발생했습니다: ' + error.message
        );
        console.error('Error fetching diary:', error);
      }
    };

    fetchDiary();
  }, [id, router]);

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!diary) {
    return <PageContainer>로딩 중...</PageContainer>;
  }

  return (
    <PageContainer>
      <Title>{diary.title}</Title>
      <Date>{formatDate(diary.created_at)}</Date>
      <Content>{diary.content}</Content>
      <BackLink href='/diary'>돌아가기</BackLink>
    </PageContainer>
  );
}
