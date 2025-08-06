import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '.';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faSearch: 'fa-search',
  faRefresh: 'fa-refresh',
}));

jest.mock('../hooks/useProducts');
jest.mock('../hooks/useUsersData'); 
jest.mock('../hooks/useCategories');

import useProducts from '../hooks/useProducts';
import useUsers from '../hooks/useUsersData';
import useCategories from '../hooks/useCategories';

const mockProducts = [
  { product_id: '1', name: 'Tomato', price_per_unit: '50', currency: 'KES', current_stock_quantity: '100', vendor_id: '1', category: '1' },
  { product_id: '2', name: 'Potato', price_per_unit: '30', currency: 'KES', current_stock_quantity: '200', vendor_id: '2', category: '2' },
  { product_id: '3', name: 'Spinach', price_per_unit: '20', currency: 'KES', current_stock_quantity: '50', vendor_id: '1', category: '1' },
];

const mockUsers = [
  { id: '1', first_name: 'Alice', last_name: 'Smith', user_type: 'mama_mboga' },
  { id: '2', first_name: 'Bob', last_name: 'Jones', user_type: 'mama_mboga' },
];

const mockCategories = [
  { category_id: '1', category_name: 'Vegetables' },
  { category_id: '2', category_name: 'Root Crops' },
];


const mockProductsWithPagination = [
  ...mockProducts,
  { product_id: '4', name: 'Cabbage', price_per_unit: '40', currency: 'KES', current_stock_quantity: '75', vendor_id: '2', category: '2' },
  { product_id: '5', name: 'Carrot', price_per_unit: '25', currency: 'KES', current_stock_quantity: '150', vendor_id: '1', category: '1' },
  { product_id: '6', name: 'Onion', price_per_unit: '35', currency: 'KES', current_stock_quantity: '120', vendor_id: '2', category: '2' },
  { product_id: '7', name: 'Lettuce', price_per_unit: '45', currency: 'KES', current_stock_quantity: '80', vendor_id: '1', category: '1' },
];

describe('ProductsPage', () => {
  let refetchProducts;
  let refetchUsers;
  let refetchCategories;

  beforeEach(() => {
    refetchProducts = jest.fn();
    refetchUsers = jest.fn();
    refetchCategories = jest.fn();

    useProducts.mockReturnValue({
      data: mockProducts,
      loading: false,
      error: null,
      refetch: refetchProducts,
    });

    useUsers.mockReturnValue({
      data: mockUsers,
      loading: false,
      error: null,
      refetch: refetchUsers,
    });

    useCategories.mockReturnValue({
      data: mockCategories,
      loading: false,
      error: null,
      refetch: refetchCategories,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when any hook is loading', () => {
    useProducts.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<ProductsPage />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('displays error message and retry button when any hook fails', () => {
    useProducts.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch products',
      refetch: refetchProducts,
    });

    render(<ProductsPage />);
    expect(screen.getByText('Error: Failed to fetch products')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: 'Retry loading data' });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(refetchProducts).toHaveBeenCalled();
  });

  test('filters products by search term', async () => {
    render(<ProductsPage />);
    const searchInput = screen.getByLabelText('Search products');

    fireEvent.change(searchInput, { target: { value: 'Tomato' } });
    await waitFor(() => {
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.queryByText('Potato')).not.toBeInTheDocument();
    });
  });

  test('filters products by category', async () => {
    render(<ProductsPage />);
    const categorySelect = screen.getByLabelText('Filter by category');

    fireEvent.change(categorySelect, { target: { value: '1' } });
    await waitFor(() => {
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.getByText('Spinach')).toBeInTheDocument();
      expect(screen.queryByText('Potato')).not.toBeInTheDocument();
    });
  });

  test('resets filters when reset button is clicked', async () => {
    render(<ProductsPage />);
    const searchInput = screen.getByLabelText('Search products');
    const resetButton = screen.getByRole('button', { name: 'Reset filters' });

    fireEvent.change(searchInput, { target: { value: 'Tomato' } });
    await waitFor(() => {
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.queryByText('Potato')).not.toBeInTheDocument();
    });

    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.getByText('Potato')).toBeInTheDocument();
    });
  });

  test('refreshes data when refresh button is clicked', () => {
    render(<ProductsPage />);
    const refreshButton = screen.getByRole('button', { name: 'Refresh all data' });

    fireEvent.click(refreshButton);
    expect(refetchProducts).toHaveBeenCalled();
    expect(refetchUsers).toHaveBeenCalled();
    expect(refetchCategories).toHaveBeenCalled();
  });

  test('shows pagination controls when more than 6 products', () => {
    useProducts.mockReturnValue({
      data: mockProductsWithPagination,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ProductsPage />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('changes page when pagination buttons are clicked', async () => {
    useProducts.mockReturnValue({
      data: mockProductsWithPagination,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ProductsPage />);
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.queryByText('Lettuce')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => {
      expect(screen.getByText('Lettuce')).toBeInTheDocument();
      expect(screen.queryByText('Tomato')).not.toBeInTheDocument();
    });
  });

  test('displays "No products found" when no products match filters', async () => {
    render(<ProductsPage />);
    const searchInput = screen.getByLabelText('Search products');

    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    await waitFor(() => {
      expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
    });
  });
});
