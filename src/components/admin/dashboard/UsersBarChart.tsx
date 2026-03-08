"use client";

import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { pv: 40 }, { pv: 30 }, { pv: 20 }, { pv: 50 }, { pv: 25 },
    { pv: 45 }, { pv: 60 }, { pv: 35 }, { pv: 20 }, { pv: 40 },
    { pv: 55 }, { pv: 30 }, { pv: 25 }, { pv: 45 }, { pv: 35 },
    { pv: 50 }, { pv: 40 }, { pv: 30 }, { pv: 60 }, { pv: 20 },
];

export default function UsersBarChart() {
    return (
        <div className="w-full h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Tooltip
                        cursor={{ fill: 'rgba(21, 163, 199, 0.1)' }}
                        contentStyle={{ display: 'none' }} // Hide default tooltip text
                    />
                    <Bar dataKey="pv" fill="#15a3c7" radius={[2, 2, 2, 2]} barSize={6} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
