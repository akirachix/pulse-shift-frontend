import React, { useState, useEffect } from 'react';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { getSalesData, getPopularProducts } from './components/SalesData';
import './style.css';
const SalesDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [salesData, setSalesData] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
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
  useEffect(() => {
    const fetchData = async () => {
      const sales = await getSalesData(timeRange, selectedMonth, selectedWeek);
      const popular = await getPopularProducts(timeRange, selectedMonth, selectedWeek);
      setSalesData(sales);
      setPopularProducts(popular);
      const total = sales.reduce((sum, item) => sum + item.value, 0);
      setTotalSales(total);
    };
    fetchData();
  }, [timeRange, selectedMonth, selectedWeek]);
  return (
    <div className="sales-dashboard">
      <div className="dashboard-header">
        <h1>Sales Report</h1>
        <div className="controls">
          <div className="time-range-selector">
            <button
              className={timeRange === 'month' ? 'active' : ''}
              onClick={() => setTimeRange('month')}
            >
              Monthly
            </button>
            <button
              className={timeRange === 'week' ? 'active' : ''}
              onClick={() => setTimeRange('week')}
            >
              Weekly
            </button>
          </div>
          <div className="dropdowns">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.name}</option>
              ))}
            </select>
            {timeRange === 'week' && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              >
                {weeks.map(week => (
                  <option key={week.value} value={week.value}>{week.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
      <div className="summary-card">
        <h3>Total Sales</h3>
        <p className="total-sales">KES {totalSales.toLocaleString()}</p>
        <p>{timeRange === 'month' ?
          `For ${months.find(m => m.value === selectedMonth)?.name}` :
          `For ${weeks.find(w => w.value === selectedWeek)?.name} of ${months.find(m => m.value === selectedMonth)?.name}`
        }</p>
      </div>
      <div className="charts-container">
        <div className="chart-wrapper">
          <h2>Sales Trend by all Mama Mbogas</h2>
          <div className="chart-container">
            <BarChart data={salesData} timeRange={timeRange} />
          </div>
        </div>
        <div className="chart-wrapper">
          <h2>Top 5 Mama Mbogas</h2>
          <div className="chart-container">
            <PieChart data={popularProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalesDashboard;