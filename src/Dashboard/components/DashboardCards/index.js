import React from 'react';

const numberWithCommas = (n) => n?.toLocaleString() || "0";

export default function DashboardCards({ summary }) {
    if (!Array.isArray(summary) || summary.length === 0) {
        return null;
    }
    
    return (
        <div className="dashboard-cards">
            {summary.map((s, i) => (
                <div className="dashboard-card" key={i}>
                    <h2>{s.title}</h2>
                    <p>
                        {s.title.includes("Sales") ? (
                            <>KES {numberWithCommas(s.value)}</>
                        ) : (
                            numberWithCommas(s.value)
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
}
