import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StockLevelData {
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
}

interface StockLevelChartProps {
  data: StockLevelData[];
}

const StockLevelChart: React.FC<StockLevelChartProps> = ({ data }) => {

  // ----------Custom tooltip to show stock levels
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ payload: StockLevelData }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-lg">
          <p className="font-bold text-slate-200 mb-2">{label}</p>
          <p className="text-sm text-cyan-400">
            Current: {data.currentStock}
          </p>
          <p className="text-sm text-red-400">
            Min: {data.minStock}
          </p>
          <p className="text-sm text-emerald-400">
            Max: {data.maxStock}
          </p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart
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
            dataKey="category"
            stroke="#94a3b8"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="currentStock"
            fill="#06b6d4" /* cyan-500 */
            name="Current Stock"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="minStock"
            fill="#ef4444" /* red-500 */
            name="Minimum Stock"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="maxStock"
            fill="#10b981" /* emerald-500 */
            name="Maximum Stock"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevelChart;