/** @jsxImportSource @emotion/react */
import Snackbar from '@/components/SnackBar';
import { supabase } from '@/lib/supabaseClient';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
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

const SignUpLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      showSnackbar('로그인 성공!', 'success');
      setTimeout(() => router.push('/diary'), 1000);
    } catch (error) {
      if (error.message === 'Email not confirmed') {
        showSnackbar(
          '이메일 주소가 확인되지 않았습니다. 이메일을 확인해주세요.',
          'info'
        );
        await handleResendConfirmationEmail();
      } else {
        showSnackbar(error.message, 'error');
      }
    }
  };

  const handleResendConfirmationEmail = async () => {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      showSnackbar(
        '확인 이메일을 다시 전송했습니다. 이메일을 확인해주세요.',
        'info'
      );
    } catch (error) {
      showSnackbar(
        '확인 이메일 재전송에 실패했습니다. 나중에 다시 시도해주세요.',
        'error'
      );
    }
  };

  return (
    <PageContainer>
      <Card>
        <Title>로그인</Title>
        <Form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor='email'>이메일</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor='password'>비밀번호</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button type='submit'>로그인</Button>
        </Form>
        <SignUpLink>
          계정이 없으신가요? <StyledLink href='/signup'>회원가입</StyledLink>
        </SignUpLink>
      </Card>
      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </PageContainer>
  );
}
