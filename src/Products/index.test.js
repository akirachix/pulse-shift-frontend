
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsPage from './';
jest.mock('../hooks/useProducts');
jest.mock('../hooks/useUsersData');
jest.mock('../hooks/useCategories');
jest.mock('../hooks/useStockRecords');

import useProducts from '../hooks/useProducts';
import useUsers from '../hooks/useUsersData';
import useCategories from '../hooks/useCategories';
import useStockRecords from '../hooks/useStockRecords';

const mockProducts = [
  { product_id: 1, name: 'Tomato', category: 10, image_url: 'tomato.jpg' },
  { product_id: 2, name: 'Onion', category: 20, image_url: 'onion.jpg' },
];

const mockUsers = [
  { id: 1, user_type: 'mama_mboga', first_name: 'Alice', last_name: 'Smith' },
  { id: 2, user_type: 'customer', first_name: 'Bob', last_name: 'Jones' },
];

const mockCategories = [
  { category_id: 10, category_name: 'Vegetables' },
  { category_id: 20, category_name: 'Roots' },
];

const mockStockRecords = [
  {
    inventory_id: 101,
    product: 1,
    mama_mboga: 1,
    price_per_unit: 100,
    currency: 'KES',
    current_stock_quantity: 50,
  },
  {
    inventory_id: 102,
    product: 2,
    mama_mboga: 1,
    price_per_unit: 80,
    currency: 'KES',
    current_stock_quantity: 30,
  },
];

describe('ProductsPage', () => {
  beforeEach(() => {
    useProducts.mockReturnValue({
      data: mockProducts,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    useUsers.mockReturnValue({
      data: mockUsers,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    useCategories.mockReturnValue({
      data: mockCategories,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    useStockRecords.mockReturnValue({
      data: mockStockRecords,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  test('shows loading spinner when loading', () => {
    useProducts.mockReturnValueOnce({ loading: true });
    useUsers.mockReturnValueOnce({ loading: true });
    useCategories.mockReturnValueOnce({ loading: true });
    useStockRecords.mockReturnValueOnce({ loading: true });

    render(<ProductsPage />);
    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
  });

  test('displays error message and retry button on error', () => {
    const errorMsg = 'Network error';
    useProducts.mockReturnValueOnce({ loading: false, error: errorMsg, refetch: jest.fn() });
    useUsers.mockReturnValueOnce({ loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValueOnce({ loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValueOnce({ loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);
    expect(screen.getByText(new RegExp(errorMsg, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('renders product table with correct data', () => {
    render(<ProductsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Onion')).toBeInTheDocument();

    expect(screen.getAllByText(/alice smith/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/vegetables/i).length).toBeGreaterThanOrEqual(1);
  });

  test('filters products by search term', () => {
    render(<ProductsPage />);
    const searchInput = screen.getByLabelText(/search products/i);

    fireEvent.change(searchInput, { target: { value: 'tomato' } });

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.queryByText('Onion')).not.toBeInTheDocument();
  });

  test('filter by category works', () => {
    render(<ProductsPage />);
    const categorySelect = screen.getByLabelText(/filter by category/i);

    fireEvent.change(categorySelect, { target: { value: '10' } });

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.queryByText('Onion')).not.toBeInTheDocument();
  });

  test('reset filters button clears search and category filters', () => {
    render(<ProductsPage />);
    const searchInput = screen.getByLabelText(/search products/i);
    const categorySelect = screen.getByLabelText(/filter by category/i);
    const resetButton = screen.getByRole('button', { name: /reset filters/i });

    fireEvent.change(searchInput, { target: { value: 'tomato' } });
    fireEvent.change(categorySelect, { target: { value: '10' } });

    expect(searchInput.value).toBe('tomato');
    expect(categorySelect.value).toBe('10');

    fireEvent.click(resetButton);

    expect(searchInput.value).toBe('');
    expect(categorySelect.value).toBe('');
  });

  test('pagination controls work properly', () => {
    const manyStockRecords = [];
    for (let i = 1; i <= 12; i++) {
      manyStockRecords.push({
        inventory_id: 100 + i,
        product: 1,
        mama_mboga: 1,
        price_per_unit: 50 + i,
        currency: 'KES',
        current_stock_quantity: 10 + i,
      });
    }
    useStockRecords.mockReturnValue({
      data: manyStockRecords,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    render(<ProductsPage />);
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
    fireEvent.click(nextButton);
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    fireEvent.click(prevButton);
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });
});
