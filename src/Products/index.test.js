import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProductsPage from './';
import '@testing-library/jest-dom';
import useProducts from '../hooks/useProducts';
import useUsers from '../hooks/useUsersData';
import useCategories from '../hooks/useCategories';
import useStockRecords from '../hooks/useStockRecords';
jest.mock('../hooks/useProducts');
jest.mock('../hooks/useUsersData');
jest.mock('../hooks/useCategories');
jest.mock('../hooks/useStockRecords');

const mockProducts = [
  { product_id: 1, name: 'Tomato', category: 10, image_url: 'tomato.jpg' },
  { product_id: 2, name: 'Onion', category: 20, image_url: 'onion.jpg' },
];

const mockUsers = [
  { id: 1, user_type: 'mama_mboga', first_name: 'Abel', last_name: 'Smith' },
  { id: 2, user_type: 'customer', first_name: 'Berisa', last_name: 'Jones' },
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
    jest.clearAllMocks();
  });

  test('shows loading spinner when any hook is loading', () => {
    useProducts.mockReturnValue({ data: null, loading: true, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: null, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: null, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: null, loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);

    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('displays error message and retry button when any hook errors', () => {
    const errorMsg = 'Network error';
    const refetchProducts = jest.fn();
    const refetchUsers = jest.fn();
    const refetchCategories = jest.fn();
    const refetchStockRecords = jest.fn();

    useProducts.mockReturnValue({ data: null, loading: false, error: errorMsg, refetch: refetchProducts });
    useUsers.mockReturnValue({ data: null, loading: false, error: null, refetch: refetchUsers });
    useCategories.mockReturnValue({ data: null, loading: false, error: null, refetch: refetchCategories });
    useStockRecords.mockReturnValue({ data: null, loading: false, error: null, refetch: refetchStockRecords });

    render(<ProductsPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(errorMsg);

    const retryButton = screen.getByRole('button', { name: /retry loading data/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);

    expect(refetchProducts).toHaveBeenCalled();
    expect(refetchUsers).not.toHaveBeenCalled();
    expect(refetchCategories).not.toHaveBeenCalled();
    expect(refetchStockRecords).not.toHaveBeenCalled();
  });

  test('renders products table and related content correctly', () => {
    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: mockStockRecords, loading: false, error: null, refetch: jest.fn() });

    const { container } = render(<ProductsPage />);
    const productTable = container.querySelector('table.products-data-table');
    expect(productTable).toBeInTheDocument();
    const tableUtils = within(productTable);
    expect(tableUtils.getByText('Tomato')).toBeInTheDocument();
    expect(tableUtils.getByText('Onion')).toBeInTheDocument();
    expect(tableUtils.getByText('Vegetables')).toBeInTheDocument();
    expect(tableUtils.getByText('Roots')).toBeInTheDocument();
    const abelCells = tableUtils.getAllByText(/Abel Smith/i);
    expect(abelCells.length).toBeGreaterThan(0);
    const images = tableUtils.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Tomato');
    expect(images[1]).toHaveAttribute('alt', 'Onion');
  });

  test('shows "No products found" message if no stock records available', () => {
    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: [], loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);
    expect(screen.getByText(/no products found matching your criteria/i)).toBeInTheDocument();
  });

  test('filter input filters product list by search term', () => {
    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: mockStockRecords, loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);

    const searchInput = screen.getByLabelText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'tomato' } });

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.queryByText('Onion')).not.toBeInTheDocument();
  });

  test('category select filters product list correctly', () => {
    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: mockStockRecords, loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);

    const categorySelect = screen.getByLabelText(/filter by category/i);
    fireEvent.change(categorySelect, { target: { value: '10' } }); 

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.queryByText('Onion')).not.toBeInTheDocument();
  });

  test('reset filters button clears search and category', () => {
    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: mockStockRecords, loading: false, error: null, refetch: jest.fn() });

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

  test('pagination controls navigate pages properly', () => {
    const manyStockRecords = [];
    for (let i = 0; i < 12; i++) {
      manyStockRecords.push({
        inventory_id: 1000 + i,
        product: 1,
        mama_mboga: 1,
        price_per_unit: 50 + i,
        currency: 'KES',
        current_stock_quantity: 10 + i,
      });
    }

    useProducts.mockReturnValue({ data: mockProducts, loading: false, error: null, refetch: jest.fn() });
    useUsers.mockReturnValue({ data: mockUsers, loading: false, error: null, refetch: jest.fn() });
    useCategories.mockReturnValue({ data: mockCategories, loading: false, error: null, refetch: jest.fn() });
    useStockRecords.mockReturnValue({ data: manyStockRecords, loading: false, error: null, refetch: jest.fn() });

    render(<ProductsPage />);

    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    const prevBtn = screen.getByRole('button', { name: /previous/i });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });
});
