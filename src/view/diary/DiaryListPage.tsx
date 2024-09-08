import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

// 가상의 다이어리 항목 타입 정의
interface DiaryEntry {
  id: number;
  title: string;
  date: string;
  preview: string;
}

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

const DiaryPreview = styled.p`
  font-size: 1rem;
  color: #333;
`;

const DiaryListPage: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    // 여기서 실제로는 API나 데이터베이스에서 다이어리 목록을 가져와야 합니다.
    // 지금은 예시 데이터를 사용합니다.
    const sampleDiaries: DiaryEntry[] = [
      {
        id: 1,
        title: '즐거운 주말',
        date: '2024-09-07',
        preview: '오늘은 가족들과 함께 공원에 다녀왔다...',
      },
      {
        id: 2,
        title: '새 프로젝트 시작',
        date: '2024-09-08',
        preview: '회사에서 새로운 프로젝트를 시작하게 되었다...',
      },
      {
        id: 3,
        title: '가을의 시작',
        date: '2024-09-09',
        preview: '오늘 아침, 선선한 바람이 불어오는 것을 느꼈다...',
      },
    ];
    setDiaries(sampleDiaries);
  }, []);

  return (
    <PageContainer>
      <Title>나의 다이어리</Title>
      <DiaryList>
        {diaries.map((diary) => (
          <DiaryItem key={diary.id}>
            <DiaryTitle>{diary.title}</DiaryTitle>
            <DiaryDate>{diary.date}</DiaryDate>
            <DiaryPreview>{diary.preview}</DiaryPreview>
          </DiaryItem>
        ))}
      </DiaryList>
    </PageContainer>
  );
};

export default DiaryListPage;
