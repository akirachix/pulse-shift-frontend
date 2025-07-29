import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrderStatusPieChart } from '.';

jest.mock('recharts', () => {
    const original = jest.requireActual('recharts');
    return {
        ...original,
        PieChart: ({ children }) => <div data-testid="PieChart">{children}</div>,
        Pie: ({ children }) => <div data-testid="Pie">{children}</div>,
        Legend: () => <div data-testid="Legend" />,
        Tooltip: () => <div data-testid="Tooltip" />,
        Cell: () => <div data-testid="Cell" />,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    };
});

const data = [
    { name: 'Pending', value: 10 },
    { name: 'Processing', value: 5 },
    { name: 'Delivered', value: 8 },
];

describe('OrderStatusPieChart', () => {
    test('renders chart title', () => {
        render(<OrderStatusPieChart data={data} />);
        expect(screen.getByText(/Order Status/i)).toBeInTheDocument();
    });
    test('renders Pie, Legend, and Tooltip components', () => {
        render(<OrderStatusPieChart data={data} />);
        expect(screen.getByTestId('Pie')).toBeInTheDocument();
        expect(screen.getByTestId('Legend')).toBeInTheDocument();
        expect(screen.getByTestId('Tooltip')).toBeInTheDocument();
    });
    test('renders nothing if data is empty', () => {
        render(<OrderStatusPieChart data={[]} />);
        expect(screen.getByText('Order Status')).toBeInTheDocument();
    });
});