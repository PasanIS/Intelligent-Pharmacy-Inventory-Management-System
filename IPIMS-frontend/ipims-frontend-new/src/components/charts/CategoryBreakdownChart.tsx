import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface CategoryBreakdownData {
  name: string;
  value: number;
  color: string;
}

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownData[];
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {

  // ----------Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString()}`;
  };



  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={data as any}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Value']}
            contentStyle={{
              backgroundColor: '#0f172a', /* slate-900 */
              borderColor: '#1e293b', /* slate-800 */
              color: '#f1f5f9', /* slate-100 */
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-slate-300 ml-2 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdownChart;