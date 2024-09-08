export const mockSupabase = {
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      resend: jest.fn(),
    },
  },
};
