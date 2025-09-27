import React, { useState, useEffect } from 'react';
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
import { getInventoryValueData } from '../../api/apiService';

interface InventoryValueData {
  date: string;
  value: number;
  category: string;
}

const InventoryValueChart: React.FC = () => {
  const [data, setData] = useState<InventoryValueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getInventoryValueData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load inventory value data');
        console.error('Error fetching inventory value data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString()}`;
  };

  // Format month for x-axis
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading inventory value data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatMonth}
            stroke="#666"
            fontSize={12}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Inventory Value']}
            labelFormatter={formatMonth}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
            name="Inventory Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryValueChart;