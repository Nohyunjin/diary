import { supabase } from '@/lib/supabaseClient';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

export default function DiaryCreatePage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { data, error } = await supabase.from('diary_entries').insert([
        {
          user_id: user.id,
          title,
          content,
          created_at: date, // 사용자가 입력한 날짜 사용
          updated_at: new Date().toISOString(), // 현재 시간으로 설정
        },
      ]);

      if (error) throw error;

      console.log('다이어리 항목 저장 성공:', data);
      router.push('/diary'); // 목록 페이지로 리다이렉트
    } catch (error: any) {
      setError(error.message);
      console.error('다이어리 항목 저장 중 오류 발생:', error);
    }
  };

  return (
    <PageContainer>
      <Title>새 다이어리 작성</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor='title'>제목</Label>
          <Input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor='date'>날짜</Label>
          <Input
            id='date'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor='content'>내용</Label>
          <TextArea
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </InputGroup>
        <Button type='submit'>저장하기</Button>
      </Form>
    </PageContainer>
  );
}
