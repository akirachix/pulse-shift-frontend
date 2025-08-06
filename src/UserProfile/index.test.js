import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import UserProfile from '.';
import useFetchUserData from '../hooks/useGetUsers';
import { BrowserRouter } from 'react-router-dom';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useGetUsers');

const mockUsers = [
  {
    id: 1,
    first_name: 'Mekonnen',
    last_name: 'Tesfaye',
    phone_number: '0912345678',
    user_type: 'customer',
    is_active: true,
    registration_date: '2023-01-01T00:00:00Z',
    email: 'mekonnen@example.com',
  },
  {
    id: 2,
    first_name: 'Samrawit',
    last_name: 'Bekele',
    phone_number: '0923456789',
    user_type: 'vendor',
    is_active: false,
    registration_date: '2023-02-01T00:00:00Z',
    email: 'samrawit@example.com',
  },
];

const renderWithRouter = (ui) =>
  render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {ui}
    </BrowserRouter>
  );

describe('UserProfile component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    useFetchUserData.mockReturnValue({ users: [], loading: true, error: null });
    renderWithRouter(<UserProfile />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('redirects to signin if auth error', () => {
    useFetchUserData.mockReturnValue({ users: [], loading: false, error: 'No authentication token found' });
    renderWithRouter(<UserProfile />);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('renders users and switches tabs', () => {
    useFetchUserData.mockReturnValue({ users: mockUsers, loading: false, error: null });
    renderWithRouter(<UserProfile />);

    expect(screen.getByText(/2 users/i)).toBeInTheDocument();

    const tabButtons = screen.getAllByRole('button', { name: /(customers|vendors)/i });

    const customersTab = tabButtons.find((btn) => btn.textContent === 'Customers');
    const vendorsTab = tabButtons.find((btn) => btn.textContent === 'Vendors');

    expect(customersTab).toHaveClass('active');
    expect(vendorsTab).not.toHaveClass('active');

    expect(screen.getByText(/Mekonnen Tesfaye/i)).toBeInTheDocument();
    expect(screen.queryByText(/Samrawit Bekele/i)).not.toBeInTheDocument();

    fireEvent.click(vendorsTab);
    expect(vendorsTab).toHaveClass('active');
    expect(customersTab).not.toHaveClass('active');

    expect(screen.getByText(/Samrawit Bekele/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mekonnen Tesfaye/i)).not.toBeInTheDocument();
  });

  test('search filters users by name or mobile', () => {
    useFetchUserData.mockReturnValue({ users: mockUsers, loading: false, error: null });
    renderWithRouter(<UserProfile />);

    const searchInput = screen.getByPlaceholderText(/search by name or number/i);

    fireEvent.change(searchInput, { target: { value: 'mekonnen' } });
    expect(screen.getByText(/Mekonnen Tesfaye/i)).toBeInTheDocument();
    expect(screen.queryByText(/Samrawit Bekele/i)).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });

    const tabs = screen.getAllByRole('button', { name: /(customers|vendors)/i });
    const vendorsTab = tabs.find((btn) => btn.textContent === 'Vendors');
    fireEvent.click(vendorsTab);
    fireEvent.change(searchInput, { target: { value: '0923' } });

    expect(screen.getByText(/Samrawit Bekele/i)).toBeInTheDocument();
  });

  test('pagination controls work', () => {
    const users = Array.from({ length: 7 }).map((_, idx) => ({
      id: idx + 1,
      first_name: `User${idx + 1}`,
      last_name: 'Tesfaye',
      phone_number: `091100000${idx}`,
      user_type: 'customer',
      is_active: true,
      registration_date: '2023-01-01T00:00:00Z',
      email: `user${idx + 1}@example.com`,
    }));

    useFetchUserData.mockReturnValue({ users, loading: false, error: null });
    renderWithRouter(<UserProfile />);

    const nextBtn = screen.getByRole('button', { name: /next/i });
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(screen.getByText(/User1 Tesfaye/i)).toBeInTheDocument();
    expect(screen.queryByText(/User6 Tesfaye/i)).not.toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(screen.getByText(/User6 Tesfaye/i)).toBeInTheDocument();
    expect(screen.queryByText(/User1 Tesfaye/i)).not.toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByText(/User1 Tesfaye/i)).toBeInTheDocument();
  });

  test('opens and closes modal with user details', () => {
    useFetchUserData.mockReturnValue({ users: mockUsers, loading: false, error: null });
    renderWithRouter(<UserProfile />);
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);
    const modal = screen.getByTestId('modal');
    expect(within(modal).getByText(/Mekonnen Tesfaye/i)).toBeInTheDocument();
    expect(within(modal).getByText(/mekonnen@example.com/i)).toBeInTheDocument();
    const closeButton = within(modal).getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(/Email:/i)).not.toBeInTheDocument();
  });
});