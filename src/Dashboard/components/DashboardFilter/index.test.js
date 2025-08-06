import { render, screen, fireEvent } from '@testing-library/react';
import DashboardFilter from '.';
jest.mock('../../../shared-components/Filter', () => ({
  __esModule: true,
  default: ({ filterType, setFilterType, options }) => (
    <select
      data-testid="custom-dropdown"
      value={filterType}
      onChange={e => setFilterType(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));
jest.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({ selected, onChange, placeholderText, dateFormat, className }) => (
    <input
      type="text"
      data-testid="date-picker"
      value={selected || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholderText}
      className={className}
    />
  ),
}));

describe('DashboardFilter (with current incomplete component)', () => {
  let filterType, setFilterType, customDate, setCustomDate, dateRange, setDateRange, error;

  beforeEach(() => {
    filterType = "day";
    setFilterType = jest.fn();
    customDate = null;
    setCustomDate = jest.fn();
    dateRange = [null, null];
    setDateRange = jest.fn();
    error = "";
  });

  test('renders dropdown filter with correct options', () => {
    render(
      <DashboardFilter
        filterType={filterType}
        setFilterType={setFilterType}
        customDate={customDate}
        setCustomDate={setCustomDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        error={error}
      />
    );
    const dropdown = screen.getByTestId('custom-dropdown');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.querySelectorAll('option').length).toBe(5);
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Choose a Date')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
  });

  test('changes filter type on dropdown change and resets dates', () => {
    render(
      <DashboardFilter
        filterType={filterType}
        setFilterType={setFilterType}
        customDate={customDate}
        setCustomDate={setCustomDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        error={error}
      />
    );
    fireEvent.change(screen.getByTestId('custom-dropdown'), { target: { value: 'week' } });

    expect(setFilterType).toHaveBeenCalledWith('week');
    expect(setCustomDate).toHaveBeenCalledWith(null);
    expect(setDateRange).toHaveBeenCalledWith([null, null]);
  });

  test('renders error message if error prop is passed in customDate mode', () => {
    error = "Invalid date";
    render(
      <DashboardFilter
        filterType="customDate"
        setFilterType={setFilterType}
        customDate={customDate}
        setCustomDate={setCustomDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        error={error}
      />
    );
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });
});