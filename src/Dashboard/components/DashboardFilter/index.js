import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDropdownFilter from '../../../shared-components/Filter';

const FILTER_OPTIONS = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "customDate", label: "Choose a Date" },
    { value: "dateRange", label: "Date Range" },
];

export default function DashboardFilter({
    filterType,
    setFilterType,
    customDate,
    setCustomDate,
    dateRange,
    setDateRange,
    error,
}) {
    const [startDate, endDate] = dateRange;

    return (
        <div className="dashboard-filter">
            <CustomDropdownFilter
                filterType={filterType}
                setFilterType={(val) => {
                    setFilterType(val);
                    setCustomDate(null);
                    setDateRange([null, null]);
                }}
                options={FILTER_OPTIONS}
            />
            {filterType === "customDate" && (
                <>
                    <DatePicker
                        selected={customDate}
                        onChange={(date) => setCustomDate(date)}
                        placeholderText="Select a date"
                        dateFormat="yyyy-MM-dd"
                        className="theme-date-input"
                    />
                    {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
                </>
            )}
            {filterType === "dateRange" && (
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="Select date range"
                    dateFormat="yyyy-MM-dd"
                    className="theme-date-input"
                />
            )}
        </div>
    );
}
