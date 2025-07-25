import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from './index.js';

import { usePasswordReset } from '../hooks/usePasswordReset';

jest.mock('../hooks/usePasswordReset');

describe('ForgotPassword Component', () => {
  const mockSendResetRequest = jest.fn();

  beforeEach(() => {
    usePasswordReset.mockReturnValue({
      sendResetRequest: mockSendResetRequest,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ForgotPassword component', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter Your Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. danait@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send OTP/i })).toBeInTheDocument();
  });

  test('displays message when OTP is sent', async () => {
    mockSendResetRequest.mockResolvedValueOnce(); 

    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Enter Your Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));

    await waitFor(() => {
      expect(mockSendResetRequest).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/OTP sent! Check your email./i)).toBeInTheDocument();
    });
  });

  test('displays error message when OTP sending fails', async () => {
    mockSendResetRequest.mockRejectedValueOnce(new Error('Failed to send OTP.')); 

    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Enter Your Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));

    await waitFor(() => {
      expect(mockSendResetRequest).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/Failed to send OTP./i)).toBeInTheDocument();
    });
  });

  test('disables button when loading', async () => {
    usePasswordReset.mockReturnValue({
      sendResetRequest: mockSendResetRequest,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Sending.../i })).toBeDisabled();
  });
});
