import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentOrdersTable from '.';


jest.mock('../../../utils/dateUtils', () => ({
    formatDate: (dateStr) => `formatted-${dateStr}`
}));

const orders = [
    {
        order_id: '1',
        order_date: '2025-07-01',
        customer: 'cust1',
        current_status: 'Processing',
        payment_status: 'Paid',
        total_amount: '1200'
    },
    {
        order_id: '2',
        order_date: '2025-07-02',
        customer: 'cust2',
        current_status: 'Shipped',
        payment_status: 'Unpaid',
        total_amount: '2300'
    },
    {
        order_id: '3',
        order_date: '2025-07-03',
        customer: 'cust3',
        current_status: 'Delivered',
        payment_status: 'Paid',
        total_amount: '3400'
    },
    {
        order_id: '4',
        order_date: '2025-07-04',
        customer: 'cust4',
        current_status: 'Processing',
        payment_status: 'Unpaid',
        total_amount: '4500'
    }
];
const customerMap = {
    cust1: 'Alice',
    cust2: 'Bob',
    cust3: 'Charlie',
    cust4: 'Dave'
};
describe('RecentOrdersTable', () => {
    test('renders table headers', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText(/Order/i)).toBeInTheDocument();
        expect(screen.getByText(/Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Customer/i)).toBeInTheDocument();
        expect(screen.getByText(/Processing Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Payment Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    });
    test('renders only 3 orders per page', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(4); // 1 header + 3 orders
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.queryByText('Dave')).not.toBeInTheDocument();
    });
    test('shows pagination controls if more than 3 orders', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    });
    test('changes page when page button is clicked', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        fireEvent.click(screen.getByRole('button', { name: '2' }));
        expect(screen.getByText('Dave')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
    test('previous/next buttons work as expected', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        // Go to next page
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Dave')).toBeInTheDocument();
        // Previous goes back
        fireEvent.click(screen.getByText('Previous'));
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    test('shows "Unknown Customer" if customer missing in map', () => {
        const newOrders = [
            { order_id: '5', order_date: '2025-07-05', customer: 'unknown', current_status: 'Processing', payment_status: 'Paid', total_amount: '1500' }
        ];
        render(<RecentOrdersTable orders={newOrders} customerMap={customerMap} />);
        expect(screen.getByText('Unknown Customer')).toBeInTheDocument();
    });
    test('formats amount with commas', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText('1,200')).toBeInTheDocument();
        expect(screen.getByText('2,300')).toBeInTheDocument();
    });
    test('capitalizes status badges', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText('Processing')).toBeInTheDocument();
        expect(screen.getAllByText('Paid').length).toBe(2);
        expect(screen.getByText('Unpaid')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
    });
    test('calls formatDate utility for date column', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText('formatted-2025-07-01')).toBeInTheDocument();
        expect(screen.getByText('formatted-2025-07-02')).toBeInTheDocument();
    });
    test('disables previous button on first page and next button on last page', () => {
        render(<RecentOrdersTable orders={orders} customerMap={customerMap} />);
        expect(screen.getByText('Previous')).toBeDisabled();
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Next')).toBeDisabled();
    });
});






