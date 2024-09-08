import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../../view/account/LoginPage';
import { mockUseRouter } from '../../mocks/nextRouter';
import { mockSupabase } from '../../mocks/supabaseMock';

// Next.js의 useRouter를 모킹합니다.
jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter,
}));

// Supabase 클라이언트를 모킹합니다.
jest.mock('../../../lib/supabaseClient.ts', () => mockSupabase);

// Snackbar 컴포넌트를 모킹합니다.
jest.mock('../../../components/SnackBar.tsx', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
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
    mockSupabase.supabase.auth.signInWithPassword.mockResolvedValue({
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
      expect(
        mockSupabase.supabase.auth.signInWithPassword
      ).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(
      () => {
        expect(mockUseRouter.push).toHaveBeenCalledWith('/diary');
      },
      { timeout: 2000 }
    );
  });

  it('shows error message on login failure', async () => {
    mockSupabase.supabase.auth.signInWithPassword.mockRejectedValue(
      new Error('Invalid login credentials')
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });
});
