import React, { useState, useEffect } from 'react';
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
import { getStockLevelData } from '../../api/apiService';

interface StockLevelData {
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
}

const StockLevelChart: React.FC = () => {
  const [data, setData] = useState<StockLevelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getStockLevelData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load stock level data');
        console.error('Error fetching stock level data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom tooltip to show stock levels
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ payload: StockLevelData }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: '5px 0', color: '#8884d8' }}>
            Current: {data.currentStock}
          </p>
          <p style={{ margin: '5px 0', color: '#ff7c7c' }}>
            Min: {data.minStock}
          </p>
          <p style={{ margin: '5px 0', color: '#82ca9d' }}>
            Max: {data.maxStock}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading stock level data...</div>
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
        <BarChart
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
            dataKey="category"
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="currentStock"
            fill="#8884d8"
            name="Current Stock"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="minStock"
            fill="#ff7c7c"
            name="Minimum Stock"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="maxStock"
            fill="#82ca9d"
            name="Maximum Stock"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevelChart;