// Next.js의 useRouter를 모킹합니다.
jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter,
}));

const mockSignInWithPassword = jest.fn();
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  },
}));

// Snackbar 컴포넌트를 모킹합니다.
jest.mock('../../../components/SnackBar.tsx', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../../view/account/LoginPage';
import { mockUseRouter } from '../../mocks/nextRouter';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);

    // 제목으로 "로그인" 텍스트를 찾습니다
    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    // 버튼으로 "로그인" 텍스트를 찾습니다
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });

  it('updates form fields when user types', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls handleLogin and redirects on successful login', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: null,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/diary');
      },
      { timeout: 2000 }
    );
  });

  it('shows error message on login failure', async () => {
    mockSignInWithPassword.mockRejectedValue(
      new Error('Invalid login credentials')
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(
      () => {
        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Invalid login credentials');
      },
      { timeout: 2000 }
    );
  });

  expect(mockPush).not.toHaveBeenCalled();
});
