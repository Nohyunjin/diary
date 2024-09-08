import Snackbar from '@/components/SnackBar';
import { supabase } from '@/lib/supabaseClient';
import styled from '@emotion/styled';
import { PostgrestError } from '@supabase/supabase-js';
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

// 타입 가드 함수 정의
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'details' in error &&
    'hint' in error &&
    'message' in error
  );
}

export default function DiaryCreatePage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });
  const router = useRouter();

  const showSnackbar = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
    setSnackbar({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const { error } = await supabase.from('diary_entries').insert([
        {
          user_id: user.id,
          title,
          content,
          created_at: date, // 사용자가 입력한 날짜 사용
          updated_at: new Date().toISOString(), // 현재 시간으로 설정
        },
      ]);

      if (error) throw error;

      router.push('/diary'); // 목록 페이지로 리다이렉트
    } catch (error) {
      if (isPostgrestError(error)) {
        showSnackbar(`데이터베이스 오류: ${error.message}`, 'error');
      } else {
        showSnackbar('알 수 없는 오류가 발생했습니다.', 'error');
      }
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
      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </PageContainer>
  );
}
