import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InventoryValueData {
  date: string;
  value: number;
  category: string;
}

interface InventoryValueChartProps {
  data: InventoryValueData[];
}

const InventoryValueChart: React.FC<InventoryValueChartProps> = ({ data }) => {

  // ----------Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString()}`;
  };

  // ----------Format month for x-axis
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };



  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tickFormatter={formatMonth}
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Inventory Value']}
            labelFormatter={formatMonth}
            contentStyle={{
              backgroundColor: '#0f172a', /* slate-900 */
              borderColor: '#1e293b', /* slate-800 */
              color: '#f1f5f9', /* slate-100 */
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: '#f1f5f9' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981" /* emerald-500 */
            strokeWidth={3}
            dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }} /* cyan-500 */
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#0f172a' }}
            name="Inventory Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryValueChart;