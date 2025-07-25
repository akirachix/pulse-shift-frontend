import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesDashboard from './'; 
jest.mock('../hooks/useSalesData', () => ({
  useSalesData: jest.fn(),
}));

jest.mock('./components/BarChart', () => (props) => (
  <div data-testid="bar-chart">BarChart: {JSON.stringify(props.data)}</div>
));

jest.mock('./components/PieChart', () => (props) => (
  <div data-testid="pie-chart">PieChart: {JSON.stringify(props.data)}</div>
));

import { useSalesData } from '../hooks/useSalesData';

describe('SalesDashboard', () => {
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
  ];

  const weeks = [
    { value: 1, name: 'Week 1' },
    { value: 2, name: 'Week 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    useSalesData.mockReturnValue({
      loading: true,
      error: null,
      salesData: [],
      popularProducts: [],
      totalSales: 0,
    });

    render(<SalesDashboard />);

    expect(screen.getByText(/loading sales data/i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    useSalesData.mockReturnValue({
      loading: false,
      error: new Error('Network error'),
      salesData: [],
      popularProducts: [],
      totalSales: 0,
    });

    render(<SalesDashboard />);

    expect(screen.getByText(/error loading sales data/i)).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  test('renders dashboard with data', () => {
    const salesData = [
      { label: 'Day 1', value: 100 },
      { label: 'Day 2', value: 200 },
    ];
    const popularProducts = [
      { name: 'Mama Mboga 1', value: 150 },
      { name: 'Mama Mboga 2', value: 100 },
    ];

    useSalesData.mockReturnValue({
      loading: false,
      error: null,
      salesData,
      popularProducts,
      totalSales: 300,
    });

    render(<SalesDashboard />);
    expect(screen.getByRole('heading', { name: /sales report/i })).toBeInTheDocument();
    expect(screen.getByText(/kes 300/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toHaveTextContent(JSON.stringify(salesData));
    expect(screen.getByTestId('pie-chart')).toHaveTextContent(JSON.stringify(popularProducts));
    const monthSelect = screen.getByLabelText(/select month/i);
    expect(monthSelect.value).toBe(String(new Date().getMonth() + 1));
    const monthlyBtn = screen.getByRole('button', { name: /monthly/i });
    const weeklyBtn = screen.getByRole('button', { name: /weekly/i });

    expect(monthlyBtn).toHaveClass('active');
    expect(weeklyBtn).not.toHaveClass('active');

    fireEvent.click(weeklyBtn);
  });
});
