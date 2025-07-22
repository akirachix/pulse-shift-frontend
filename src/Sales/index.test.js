import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SalesDashboard from '.';

jest.mock('./components/BarChart', () => () => <div>Mock BarChart</div>);
jest.mock('./components/PieChart', () => () => <div>Mock PieChart</div>);
jest.mock('./components/SalesData', () => ({
  getSalesData: jest.fn(),
  getPopularProducts: jest.fn(),
}));

import { getSalesData, getPopularProducts } from './components/SalesData';

describe('SalesDashboard', () => {
  beforeEach(() => {
    getSalesData.mockResolvedValue([
      { label: 'Mama 1', value: 200 },
      { label: 'Mama 2', value: 300 },
    ]);
    getPopularProducts.mockResolvedValue([
      { label: 'Mama 1', value: 100 },
      { label: 'Mama 3', value: 150 },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard and fetches data on mount', async () => {
    render(<SalesDashboard />);
    expect(screen.getByText(/Sales Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Sales/i)).toBeInTheDocument();
    expect(screen.getByText('Mock BarChart')).toBeInTheDocument();
    expect(screen.getByText('Mock PieChart')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/KES 500/)).toBeInTheDocument()
    );
  });

  it('updates data when month is changed', async () => {
    render(<SalesDashboard />);
    const monthSelect = screen.getByRole('combobox');
    fireEvent.change(monthSelect, { target: { value: '2' } }); 

    await waitFor(() => {
      expect(getSalesData).toHaveBeenLastCalledWith('month', 2, expect.any(Number));
      expect(getPopularProducts).toHaveBeenLastCalledWith('month', 2, expect.any(Number));
    });
  });

  it('updates data and UI when switching to weekly', async () => {
    render(<SalesDashboard />);
    const weekButton = screen.getByText('Weekly');
    fireEvent.click(weekButton);

    await waitFor(() => {
      expect(getSalesData).toHaveBeenLastCalledWith('week', expect.any(Number), 1);
      expect(getPopularProducts).toHaveBeenLastCalledWith('week', expect.any(Number), 1);
    });

    const weekOption = screen.getByRole('option', { name: 'Week 1' });
    expect(weekOption).toBeInTheDocument();

    const summaryText = screen.getByText(/^For Week 1 of/);
    expect(summaryText).toBeInTheDocument();
  });

  it('shows correct summary for month and week', async () => {
    render(<SalesDashboard />);

  
    const months = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October',
      'November', 'December',
    ];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = months[currentMonthIndex];

  
    await waitFor(() =>
      expect(screen.getByText(new RegExp(`For ${currentMonthName}`, 'i'))).toBeInTheDocument()
    );

 
    fireEvent.click(screen.getByText('Weekly'));
    await waitFor(() =>
      expect(screen.getByText(new RegExp(`For Week 1 of ${currentMonthName}`, 'i'))).toBeInTheDocument()
    );
  });
});
