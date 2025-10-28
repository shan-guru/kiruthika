import React, { useEffect, useState } from 'react'
import api from '../api'

type Row = {
  date: string
  customerName: string
  billNumber: string
  purchaseAmount: number
  paymentAmount: number
  balance: number
}

export default function CustomerReportPage() {
  const [filters, setFilters] = useState({ name: '', start: '', end: '' })
  const [rows, setRows] = useState<Row[]>([])
  const [totals, setTotals] = useState({ totalSales: 0, totalPayments: 0, outstandingReceivables: 0 })

  const load = async () => {
    const params: any = {}
    if (filters.name) params.name = filters.name
    if (filters.start) params.start = filters.start
    if (filters.end) params.end = filters.end
    const res = await api.get('/api/reports/customers', { params })
    setRows(res.data.items || [])
    setTotals({
      totalSales: Number(res.data.totalSales || 0),
      totalPayments: Number(res.data.totalPayments || 0),
      outstandingReceivables: Number(res.data.outstandingReceivables || 0)
    })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card">
      <h2 className="section-title">Customer Report</h2>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="col-4"><label>Customer</label><input value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} /></div>
        <div className="col-4"><label>Start</label><input type="date" value={filters.start} onChange={e => setFilters({ ...filters, start: e.target.value })} /></div>
        <div className="col-4"><label>End</label><input type="date" value={filters.end} onChange={e => setFilters({ ...filters, end: e.target.value })} /></div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={load}>Generate</button>
      </div>
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Customer</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Bill</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Purchase</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Payment</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8 }}>{r.date}</td>
                <td style={{ padding: 8 }}>{r.customerName}</td>
                <td style={{ padding: 8 }}>{r.billNumber}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{r.purchaseAmount?.toLocaleString()}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{r.paymentAmount?.toLocaleString()}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{r.balance?.toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 12, color: '#b5bddb' }}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
        <div className="hint">Total Sales: {totals.totalSales.toLocaleString()}</div>
        <div className="hint">Total Payments: {totals.totalPayments.toLocaleString()}</div>
        <div className="hint">Outstanding Receivables: {totals.outstandingReceivables.toLocaleString()}</div>
      </div>
    </div>
  )
}


