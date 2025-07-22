import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from './index';
import { MemoryRouter } from 'react-router-dom';

const mockedNavigate = jest.fn();
const mockSubmitResetPassword = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    state: { email: 'test@example.com', otp: '123456' },
  }),
}));

jest.mock('../hooks/usePasswordReset', () => ({
  usePasswordReset: () => ({
    submitResetPassword: mockSubmitResetPassword,
    loading: false,
    error: null,
  }),
}));

global.alert = jest.fn();

describe('ResetPassword component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    mockSubmitResetPassword.mockClear();
    global.alert.mockClear();
  });

  test('renders inputs and toggle buttons', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ResetPassword />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();

    const toggleButtons = screen.getAllByLabelText(/show password/i);
    expect(toggleButtons.length).toBe(2);

    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  test('shows alert if passwords do not match', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'pass1' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'pass2' } });
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    expect(global.alert).toHaveBeenCalledWith('Passwords do not match!');
  });

  test('successful password reset submits and navigates', async () => {
    mockSubmitResetPassword.mockResolvedValueOnce();

    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => expect(mockSubmitResetPassword).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/password successfully changed!/i)).toBeInTheDocument());
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/reset-notification'));
  });


});
