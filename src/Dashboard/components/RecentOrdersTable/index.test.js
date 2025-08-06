import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentOrdersTable from '.';
jest.mock('../../../utils/dateUtils', () => ({
  formatDate: (dateStr) => `formatted-${dateStr}`,
}));

const orders = [
  {
    order_id: '1',
    order_date: '2025-07-01',
    customer: 'cust1',
    current_status: 'pending',
    payment_status: 'Confirmed',
    total_amount: '1200',
  },
  {
    order_id: '2',
    order_date: '2025-07-02',
    customer: 'cust2',
    current_status: 'processing',
    payment_status: 'Confirmed',
    total_amount: '2300',
  },
  {
    order_id: '3',
    order_date: '2025-07-03',
    customer: 'cust3',
    current_status: 'paid',
    payment_status: 'Confirmed',
    total_amount: '3400',
  },
  {
    order_id: '4',
    order_date: '2025-07-04',
    customer: 'cust4',
    current_status: 'delivered',
    payment_status: 'Confirmed',
    total_amount: '4500',
  },
];

const customerMap = {
  cust1: 'Alice',
  cust2: 'Bob',
  cust3: 'Charlie',
  cust4: 'Dave',
};

describe('RecentOrdersTable', () => {
  test('renders table headers correctly', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    expect(screen.getByRole('columnheader', { name: /^Order$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Customer Name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Order Status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Date/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Amount\(KES\)/i })).toBeInTheDocument();
  });

  test('renders only 3 orders per page', () => {
    const threeOrders = orders.slice(0, 3);
    render(<RecentOrdersTable orders={threeOrders} customerMap={customerMap} />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(4); 
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('shows pagination controls when more than 3 orders', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  test('changes page when page button is clicked', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Dave')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  test('previous/next pagination buttons work correctly', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    const previousButton = screen.getByRole('button', { name: /Previous/i });
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(previousButton).not.toBeDisabled();
    fireEvent.click(previousButton);
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test('displays "Yordanos Hagos" if customer is missing in map', () => {
    const newOrders = [
      {
        order_id: '5',
        order_date: '2025-07-05',
        customer: 'unknown',
        current_status: 'pending',
        payment_status: 'Confirmed',
        total_amount: '1500',
      },
    ];
    render(<RecentOrdersTable orders={newOrders} customerMap={customerMap} />);
    expect(screen.getByText('Yordanos Hagos')).toBeInTheDocument();
  });

  test('formats amount with commas', () => {
    const threeOrders = orders.slice(0, 3); 
    render(<RecentOrdersTable orders={threeOrders} customerMap={customerMap} />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('2,300')).toBeInTheDocument();
    expect(screen.getByText('3,400')).toBeInTheDocument();
  });

  test('status badges capitalized correctly', () => {
    const testOrders = [
      { order_id: '1', order_date: '2025-07-01', customer: 'cust1', current_status: 'pending', total_amount: '1200' },
      { order_id: '2', order_date: '2025-07-02', customer: 'cust2', current_status: 'processing', total_amount: '2300' },
      { order_id: '3', order_date: '2025-07-03', customer: 'cust3', current_status: 'delivered', total_amount: '3400' },
    ];
    const testCustomerMap = {
      cust1: 'Alice',
      cust2: 'Bob',
      cust3: 'Charlie',
    };
    render(<RecentOrdersTable orders={testOrders} customerMap={testCustomerMap} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  test('calls formatDate utility for date column', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    expect(screen.getByText('formatted-2025-07-01')).toBeInTheDocument();
    expect(screen.getByText('formatted-2025-07-02')).toBeInTheDocument();
  });

  test('disables previous button on first page and next button on last page', () => {
    render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
    const previousButton = screen.getByRole('button', { name: /Previous/i });
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(previousButton).not.toBeDisabled();
  });
});