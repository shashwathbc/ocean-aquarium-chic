"use client";

import { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Sun', customers: 15, stock: 12, revenue: 20 },
    { name: 'Mon', customers: 25, stock: 15, revenue: 28 },
    { name: 'Tue', customers: 18, stock: 10, revenue: 22 },
    { name: 'Wed', customers: 38, stock: 25, revenue: 45 },
    { name: 'Thu', customers: 35, stock: 22, revenue: 40 },
    { name: 'Fri', customers: 15, stock: 8, revenue: 18 },
    { name: 'Sat', customers: 30, stock: 18, revenue: 35 },
];

export default function WeeklyReportChart() {
    return (
        <div className="w-full h-[240px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#15a3c7" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#15a3c7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `${value}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#15a3c7', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#15a3c7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
