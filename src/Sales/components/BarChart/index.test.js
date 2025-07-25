import React from 'react';
import { render, screen } from '@testing-library/react';
import BarChart from './index'; 
jest.mock('react-chartjs-2', () => ({
  Bar: (props) => (
    <div data-testid="bar-chart-mock">
      <div>Labels: {props.data.labels.join(', ')}</div>
      <div>Data: {props.data.datasets[0].data.join(', ')}</div>
      <div>Title: {props.options.plugins.title.text}</div>
    </div>
  )
}));

describe('BarChart component', () => {
  const sampleData = [
    { label: 'Day 1', value: 100 },
    { label: 'Day 2', value: 200 },
    { label: 'Day 3', value: 150 },
  ];

  test('renders BarChart with monthly timeRange', () => {
    render(<BarChart data={sampleData} timeRange="month" />);

    const barChartMock = screen.getByTestId('bar-chart-mock');
    expect(barChartMock).toBeInTheDocument();
    expect(barChartMock).toHaveTextContent('Labels: Day 1, Day 2, Day 3');
    expect(barChartMock).toHaveTextContent('Data: 100, 200, 150');
    expect(barChartMock).toHaveTextContent('Title: Daily Sales for the Month');
  });

  test('renders BarChart with weekly timeRange', () => {
    render(<BarChart data={sampleData} timeRange="week" />);

    const barChartMock = screen.getByTestId('bar-chart-mock');
    expect(barChartMock).toBeInTheDocument();
    expect(barChartMock).toHaveTextContent('Title: Daily Sales for the Week');
  });

  test('renders empty data without crashing', () => {
    render(<BarChart data={[]} timeRange="month" />);
    expect(screen.getByTestId('bar-chart-mock')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart-mock')).toHaveTextContent('Labels: ');
    expect(screen.getByTestId('bar-chart-mock')).toHaveTextContent('Data: ');
  });
});
