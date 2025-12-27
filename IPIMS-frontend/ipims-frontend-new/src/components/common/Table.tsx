import React from 'react';

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
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-medium">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-4 tracking-wider">{col.header}</th>
            ))}
            {actions && <th className="px-6 py-4 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-slate-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row, index) : String(row[col.key])}
                  </td>
                ))}
                {actions && <td className="px-6 py-4 text-center">{actions(row, index)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-slate-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;