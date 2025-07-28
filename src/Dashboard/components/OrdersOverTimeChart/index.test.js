/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrdersOverTimeChart } from '.';

jest.mock('recharts', () => {
    const original = jest.requireActual('recharts');
    return {
        ...original,
        LineChart: (props) => <div data-testid="LineChart">{props.children}</div>,
        Line: (props) => <div data-testid="Line" />,
        XAxis: (props) => <div data-testid="XAxis" />,
        YAxis: (props) => <div data-testid="YAxis" />,
        Legend: () => <div data-testid="Legend">orders</div>,
        Tooltip: () => <div data-testid="Tooltip" />,
        CartesianGrid: () => <div data-testid="CartesianGrid" />,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    };
});

const data = [
    { date: '2025-07-20', orders: 10 },
    { date: '2025-07-21', orders: 15 },
    { date: '2025-07-22', orders: 7 },
];

describe('OrdersOverTimeChart', () => {
    test('renders chart title', () => {
        render(<OrdersOverTimeChart data={data} />);
        expect(screen.getByText(/Orders Over Time/i)).toBeInTheDocument();
    });
    test('renders X and Y axes', () => {
        render(<OrdersOverTimeChart data={data} />);
        expect(screen.getByTestId('XAxis')).toBeInTheDocument();
        expect(screen.getByTestId('YAxis')).toBeInTheDocument();
    });
    test('renders line, legend, tooltip, and grid', () => {
        render(<OrdersOverTimeChart data={data} />);
        expect(screen.getByTestId('Line')).toBeInTheDocument();
        expect(screen.getByTestId('Legend')).toBeInTheDocument();
        expect(screen.getByTestId('Tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('CartesianGrid')).toBeInTheDocument();
    });
    test('renders nothing if data is empty', () => {
        render(<OrdersOverTimeChart data={[]} />);
        expect(screen.getByText('Orders Over Time')).toBeInTheDocument();
    });
});