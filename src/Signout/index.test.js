import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signout from '../Signout';
import { useAuth } from '../AuthContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockSetIsAuthenticated = jest.fn();
jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    setIsAuthenticated: mockSetIsAuthenticated,
  }),
}));

const localStorageMock = {
  removeItem: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Signout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial sign out prompt', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Signout />
      </MemoryRouter>
    );
    expect(screen.getByText(/Are you sure you want to sign out/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });

  test('shows confirmation buttons after clicking Sign Out', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Signout />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
    expect(screen.getByText(/Confirm sign out/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('confirms logout and navigates to /signin', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Signout />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('cancels logout confirmation', () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Signout />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });
});
