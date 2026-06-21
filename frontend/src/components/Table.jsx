import React from 'react';

const Table = ({ columns, data, loading, emptyMessage = 'Data tidak ditemukan' }) => {
  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-card">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50 text-left font-display">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200 text-sm font-body">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-neutral-500">
                Memuat data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-neutral-50/50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-neutral-700">
                    {col.render ? col.header === 'Actions' || col.header === 'Aksi' ? col.render(row) : col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
