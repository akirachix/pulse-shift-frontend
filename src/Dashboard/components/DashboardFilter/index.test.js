/* eslint-disable testing-library/no-node-access */
import React from 'react';
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
    default: ({ selected, onChange, selectsRange, startDate, endDate, placeholderText, className }) => (
        <input
            data-testid={selectsRange ? 'date-range-picker' : 'date-picker'}
            value={selected || (startDate && endDate ? `${startDate} - ${endDate}` : '')}
            placeholder={placeholderText}
            className={className}
            onChange={e => {
                // Simulate date change
                if (selectsRange) {
                    const [start, end] = e.target.value.split(' - ');
                    onChange([start, end]);
                } else {
                    onChange(e.target.value);
                }
            }}
        />
    ),
}));

describe('DashboardFilter', () => {
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
    test('renders custom date picker when filterType is customDate', () => {
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
        expect(screen.getByTestId('date-picker')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
    });
    test('calls setCustomDate when date is picked', () => {
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
        fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2025-07-25' } });
        expect(setCustomDate).toHaveBeenCalledWith('2025-07-25');
    });
    test('shows error message if error prop is passed in customDate mode', () => {
        render(
            <DashboardFilter
                filterType="customDate"
                setFilterType={setFilterType}
                customDate={customDate}
                setCustomDate={setCustomDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                error="Invalid date"
            />
        );
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });
    test('renders date range picker when filterType is dateRange', () => {
        render(
            <DashboardFilter
                filterType="dateRange"
                setFilterType={setFilterType}
                customDate={customDate}
                setCustomDate={setCustomDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                error={error}
            />
        );
        expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Select date range')).toBeInTheDocument();
    });
    test('calls setDateRange when date range is picked', () => {
        render(
            <DashboardFilter
                filterType="dateRange"
                setFilterType={setFilterType}
                customDate={customDate}
                setCustomDate={setCustomDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                error={error}
            />
        );
        fireEvent.change(screen.getByTestId('date-range-picker'), { target: { value: '2025-07-20 - 2025-07-25' } });
        expect(setDateRange).toHaveBeenCalledWith(['2025-07-20', '2025-07-25']);
    });
});