import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getCategoryBreakdownData } from '../../api/apiService';

interface CategoryBreakdownData {
  name: string;
  value: number;
  color: string;
}

const CategoryBreakdownChart: React.FC = () => {
  const [data, setData] = useState<CategoryBreakdownData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCategoryBreakdownData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load category breakdown data');
        console.error('Error fetching category breakdown data:', err);
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

  if (loading) {
    return (
      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading category breakdown data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
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
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Value']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} - {formatCurrency(entry.payload?.value || 0)}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdownChart;