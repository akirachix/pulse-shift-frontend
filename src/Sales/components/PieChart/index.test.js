import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from '.';


jest.mock('react-chartjs-2', () => ({
  Pie: (props) => <div data-testid="pie-chart">{JSON.stringify(props.data)}</div>
}));

jest.mock('chart.js', () => {
  const actualChart = jest.requireActual('chart.js');
  return {
    ...actualChart,
    Chart: {
      register: jest.fn(),
    },
    ArcElement: jest.fn(),
    Tooltip: jest.fn(),
    Legend: jest.fn(),
  };
});

describe('PieChart component', () => {
  it('renders with given data', () => {
    const testData = [
      { name: 'Product1', value: 10 },
      { name: 'Product2', value: 20 },
      { name: 'Product3', value: 30 },
    ];

    render(<PieChart data={testData} />);

  
    const pie = screen.getByTestId('pie-chart');
    expect(pie).toBeInTheDocument();
    expect(pie.textContent).toContain('Product1');
    expect(pie.textContent).toContain('10');
    expect(pie.textContent).toContain('Product2');
    expect(pie.textContent).toContain('20');
  });
});
