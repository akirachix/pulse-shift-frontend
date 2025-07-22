import React from 'react';
import { render, screen } from '@testing-library/react';
import BarChart from '.';


jest.mock('react-chartjs-2', () => ({
  Bar: (props) => <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>
}));


jest.mock('chart.js', () => {
  const actualChart = jest.requireActual('chart.js');
  return {
    ...actualChart,
    Chart: {
      register: jest.fn(),
    },
    CategoryScale: jest.fn(),
    LinearScale: jest.fn(),
    BarElement: jest.fn(),
    Title: jest.fn(),
    Tooltip: jest.fn(),
    Legend: jest.fn(),
  };
});

describe('BarChart component', () => {
  it('renders with given data and timeRange "month"', () => {
    const testData = [
      { label: '1', value: 100 },
      { label: '2', value: 150 },
      { label: '3', value: 200 },
    ];

    render(<BarChart data={testData} timeRange="month" />);
    const bar = screen.getByTestId('bar-chart');

    expect(bar).toBeInTheDocument();
    expect(bar.textContent).toContain('1');
    expect(bar.textContent).toContain('100');
  });

  it('renders with given data and timeRange "week"', () => {
    const testData = [
      { label: 'Mon', value: 50 },
      { label: 'Tue', value: 75 },
      { label: 'Wed', value: 125 },
    ];

    render(<BarChart data={testData} timeRange="week" />);
    const bar = screen.getByTestId('bar-chart');

    expect(bar).toBeInTheDocument();
    expect(bar.textContent).toContain('Mon');
    expect(bar.textContent).toContain('50');
  });
});
