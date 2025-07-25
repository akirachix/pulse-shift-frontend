import React, { useState } from 'react';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { useSalesData } from '../hooks/useSalesData';
import './style.css';

const SalesDashboard = () => {
  const [timeRange, setTimeRange] = useState('month'); 
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedWeek, setSelectedWeek] = useState(1);
  const {
    salesData,
    popularProducts,
    totalSales,
    loading,
    error,
  } = useSalesData(timeRange, selectedMonth, selectedWeek);
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  const weeks = [
    { value: 1, name: 'Week 1' },
    { value: 2, name: 'Week 2' },
    { value: 3, name: 'Week 3' },
    { value: 4, name: 'Week 4' },
  ];
  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }
  if (error) {
    return <div className="error">Error loading sales data: {error.message}</div>;
  }

  return (
    <div className="sales-dashboard">
      <div className="dashboard-header">
        <h1>Sales Report</h1>
        <div className="controls">
          <div
            className="time-range-selector"
            role="group"
            aria-label="Time Range Selector"
          >
            <button
              className={timeRange === 'month' ? 'active' : ''}
              aria-pressed={timeRange === 'month'}
              onClick={() => setTimeRange('month')}
            >
              Monthly
            </button>
            <button
              className={timeRange === 'week' ? 'active' : ''}
              aria-pressed={timeRange === 'week'}
              onClick={() => setTimeRange('week')}
            >
              Weekly
            </button>
          </div>
          <div className="dropdowns">
            <label htmlFor="month-select" className="visually-hidden">
              Select Month
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>

            {timeRange === 'week' && (
              <>
                <label htmlFor="week-select" className="visually-hidden">
                  Select Week
                </label>
                <select
                  id="week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
                >
                  {weeks.map((week) => (
                    <option key={week.value} value={week.value}>
                      {week.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="summary-card"
        role="region"
        aria-label="Total Sales Summary"
      >
        <h3>Total Sales</h3>
        <p className="total-sales" aria-live="polite">
          KES {totalSales.toLocaleString()}
        </p>
        <p>
          {timeRange === 'month'
            ? `For ${months.find((m) => m.value === selectedMonth)?.name || ''}`
            : `For ${
                weeks.find((w) => w.value === selectedWeek)?.name || ''
              } of ${months.find((m) => m.value === selectedMonth)?.name || ''}`}
        </p>
      </div>
      <div className="charts-container">
        <section
          className="chart-wrapper"
          aria-label="Sales Trend Over Time"
        >
          <h2>Sales Trend by all Mama Mbogas</h2>
          <div className="chart-container">
            <BarChart data={salesData} timeRange={timeRange} />
          </div>
        </section>

        <section
          className="chart-wrapper"
          aria-label="Top 5 Mama Mbogas by Sales"
        >
          <h2>Top 5 Mama Mbogas</h2>
          <div className="chart-container">
            <PieChart data={popularProducts} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SalesDashboard;
