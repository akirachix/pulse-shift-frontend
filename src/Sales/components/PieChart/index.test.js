import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from './index'; 
jest.mock('react-chartjs-2', () => ({
  Pie: (props) => (
    <div data-testid="pie-chart-mock">
      <div>Labels: {props.data.labels.join(', ')}</div>
      <div>Data: {props.data.datasets[0].data.join(', ')}</div>
      <div>Title: {props.options.plugins.title.text}</div>
    </div>
  ),
}));

describe('PieChart component', () => {
  const sampleData = [
    { name: 'Product A', value: 100 },
    { name: 'Product B', value: 200 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 400 },
    { name: 'Product E', value: 500 },
  ];

  test('renders PieChart with data correctly', () => {
    render(<PieChart data={sampleData} />);

    const pieChartMock = screen.getByTestId('pie-chart-mock');
    expect(pieChartMock).toBeInTheDocument();
    expect(pieChartMock).toHaveTextContent('Labels: Product A, Product B, Product C, Product D, Product E');
    expect(pieChartMock).toHaveTextContent('Data: 100, 200, 300, 400, 500');
    expect(pieChartMock).toHaveTextContent('Title: Product Sales Distribution');
  });

  test('renders PieChart with empty data without crashing', () => {
    render(<PieChart data={[]} />);
    const pieChartMock = screen.getByTestId('pie-chart-mock');

    expect(pieChartMock).toBeInTheDocument();

    expect(pieChartMock).toHaveTextContent('Labels: ');
    expect(pieChartMock).toHaveTextContent('Data: ');
  });
});
