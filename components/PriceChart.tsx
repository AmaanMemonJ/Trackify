import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  color?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 10, fill: '#64748b'}} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
          />
          <YAxis 
            hide 
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [`$${value}`, 'Price']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            dot={{ r: 3, fill: color }} 
            activeDot={{ r: 5, fill: '#fff', stroke: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};