import React from 'react';
import '../../styles/common/table.css';

export interface TableColumn<T> {
  key: string & keyof T;
  header: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T, index: number) => React.ReactNode;
}

const Table = <T extends object>({ columns, data, actions }: TableProps<T>) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
            {actions && <th style={{ textAlign: 'center', fontWeight: '600' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render ? col.render(row[col.key], row, index) : String(row[col.key])}
                </td>
              ))}
              {actions && <td className="actions-cell">{actions(row, index)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;