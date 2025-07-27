/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCards from '.';


const summaryData = [
    { title: 'Total Sales', value: 1234567 },
    { title: 'Active Users', value: 98 },
    { title: 'Monthly Sales', value: 50000 },
    { title: 'Inactive Users', value: 0 }
];

describe('DashboardCards', () => {
    it('renders a card for each summary item', () => {
        render(<DashboardCards summary={summaryData} />);
        const cards = screen.getAllByRole('heading', { level: 2 });
        expect(cards).toHaveLength(summaryData.length);
    });
    it('renders the title for each card', () => {
        render(<DashboardCards summary={summaryData} />);
        summaryData.forEach(item => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        });
    });
    it('formats values with commas for non-Sales titles', () => {
        render(<DashboardCards summary={summaryData} />);
        expect(screen.getByText('98')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });
    it('formats values with KES prefix for Sales titles', () => {
        render(<DashboardCards summary={summaryData} />);
        expect(screen.getByText('KES 1,234,567')).toBeInTheDocument();
        expect(screen.getByText('KES 50,000')).toBeInTheDocument();
    });
    it('shows "0" if value is undefined', () => {
        const dataWithUndefined = [{ title: 'Total Sales', value: undefined }];
        render(<DashboardCards summary={dataWithUndefined} />);
        expect(screen.getByText('KES 0')).toBeInTheDocument();
    });
    it('renders nothing if summary is empty', () => {
        const { container } = render(<DashboardCards summary={[]} />);
        expect(container.querySelectorAll('.dashboard-card')).toHaveLength(0);
    });
    it('handles non-array summary gracefully', () => {
        // @ts-ignore
        const { container } = render(<DashboardCards summary={null} />);
        expect(container.querySelectorAll('.dashboard-card')).toHaveLength(0);
    });
});