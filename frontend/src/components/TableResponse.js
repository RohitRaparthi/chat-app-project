import React from 'react';

export default function TableResponse({ table }) {
  if (!table) return null;
  const { columns, rows } = table;
  return (
    <div className="table-wrap">
      <table className="table" role="table">
        <thead>
          <tr>
            {columns.map((c, i) => <th key={i}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => <td key={j}>{String(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
