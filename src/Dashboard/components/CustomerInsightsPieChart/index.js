import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CUSTOMER_COLORS = ["#FFBB28", "#00C321"];

export function CustomerInsightsPieChart({ data, noResponsive }) {
    const Chart = (
        <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
    return (
        <div className="dashboard-chart">
            <h3>Customer Insights</h3>
            {noResponsive
                ? <div style={{ width: 400, height: 300 }}>{Chart}</div>
                : <ResponsiveContainer width="100%" height={300}>{Chart}</ResponsiveContainer>
            }
        </div>
    );
}