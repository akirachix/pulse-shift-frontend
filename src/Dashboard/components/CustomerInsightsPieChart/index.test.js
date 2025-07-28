/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomerInsightsPieChart } from '.';

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

const mockData = [
    { name: 'Returning Customers', value: 400 },
    { name: 'New Customers', value: 300 },
];

describe('CustomerInsightsPieChart', () => {
    test('renders chart title', () => {
        render(<CustomerInsightsPieChart data={mockData} noResponsive />);
        expect(screen.getByText(/Customer Insights/i)).toBeInTheDocument();
    });

    test('renders Pie and Legend', () => {
        render(<CustomerInsightsPieChart data={mockData} noResponsive />);
        expect(screen.getByTestId('Pie')).toBeInTheDocument();
        expect(screen.getByTestId('Legend')).toBeInTheDocument();
    });
});