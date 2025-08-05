import React from 'react';
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
                    
                        selected={customDate}
                        onChange={(date) => setCustomDate(date)}
                        placeholderText="Select a date"
                        dateFormat="yyyy-MM-dd"
                        className="theme-date-input"
                    
                    {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
                </>
            )}
        </div>
    );
}
// import DatePicker from "react-datepicker";