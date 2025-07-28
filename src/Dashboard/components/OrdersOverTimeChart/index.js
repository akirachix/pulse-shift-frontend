import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function OrdersOverTimeChart({ data }) {
    return (
        <div className="dashboard-chart">
            <h3>Orders Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ left: 0, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#00C321" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
