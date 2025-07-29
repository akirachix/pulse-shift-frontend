/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopVendorsChart } from '.';

const data = [
    { name: 'Vendor A', sales: 1200 },
    { name: 'Vendor B', sales: 900 },
    { name: 'Vendor C', sales: 500 },
];

jest.mock('recharts', () => {
    const Original = jest.requireActual('recharts');
    return {
        ...Original,
        BarChart: (props) => <div data-testid="BarChart">{props.children}</div>,
        Bar: (props) => <div data-testid="Bar" />,
        XAxis: (props) => <div data-testid="XAxis" />,
        YAxis: (props) => <div data-testid="YAxis" />,
        Tooltip: (props) => <div data-testid="Tooltip" />,
        CartesianGrid: (props) => <div data-testid="CartesianGrid" />,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    };
});

describe('TopVendorsChart', () => {
    test('renders chart elements', () => {
        render(<TopVendorsChart data={data} />);
        expect(screen.getByTestId('BarChart')).toBeInTheDocument();
        expect(screen.getByTestId('Bar')).toBeInTheDocument();
        expect(screen.getByTestId('XAxis')).toBeInTheDocument();
        expect(screen.getByTestId('YAxis')).toBeInTheDocument();
        expect(screen.getByTestId('Tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('CartesianGrid')).toBeInTheDocument();
    });

    test('renders chart title', () => {
        render(<TopVendorsChart data={data} />);
        expect(screen.getByText(/Top Vendors/i)).toBeInTheDocument();
    });

    test('renders ResponsiveContainer with chart', () => {
        render(<TopVendorsChart data={data} />);
        expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
});