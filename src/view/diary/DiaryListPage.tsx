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
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CreateButton = styled.a`
  display: inline-block;
  background-color: #10B981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

const DiaryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DiaryItem = styled.li`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DiaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const DiaryDate = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  weather: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDiaries = async () => {
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setDiaries(data);
        }
      } catch (error) {
        setError('다이어리를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching diaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [router]);

  const handleDiaryClick = (id: string) => {
    router.push(`/diary/${id}`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer>
      <Title>나의 다이어리</Title>
      <Link href='/diary/create' passHref>
        <CreateButton>새 다이어리 작성</CreateButton>
      </Link>
      <DiaryList>
        {diaries.map((diary) => (
          <DiaryItem key={diary.id} onClick={() => handleDiaryClick(diary.id)}>
            <DiaryTitle>{diary.title}</DiaryTitle>
            <DiaryDate>{formatDate(diary.created_at)}</DiaryDate>
          </DiaryItem>
        ))}
      </DiaryList>
    </PageContainer>
  );
}
