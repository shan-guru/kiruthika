import React, { useEffect, useState } from 'react'
import api from '../api'

type Row = {
  date: string
  supplierName: string
  billNumber: string
  purchaseAmount: number
  settlementAmount: number
  balance: number
}

export default function SupplierReportPage() {
  const [filters, setFilters] = useState({ name: '', billNumber: '', start: '', end: '' })
  const [rows, setRows] = useState<Row[]>([])
  const [totals, setTotals] = useState({ totalPurchases: 0, totalSettlements: 0, outstandingBalance: 0 })

  const load = async () => {
    const params: any = {}
    if (filters.name) params.name = filters.name
    if (filters.billNumber) params.billNumber = filters.billNumber
    if (filters.start) params.start = filters.start
    if (filters.end) params.end = filters.end
    const res = await api.get('/api/reports/suppliers', { params })
    setRows(res.data.items || [])
    setTotals({
      totalPurchases: Number(res.data.totalPurchases || 0),
      totalSettlements: Number(res.data.totalSettlements || 0),
      outstandingBalance: Number(res.data.outstandingBalance || 0)
    })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card">
      <h2 className="section-title">Supplier Report</h2>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="col-4"><label>Supplier</label><input value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} /></div>
        <div className="col-4"><label>Bill Number</label><input value={filters.billNumber} onChange={e => setFilters({ ...filters, billNumber: e.target.value })} /></div>
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
              <th style={{ textAlign: 'left', padding: 8 }}>Supplier</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Bill</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Purchase</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Settlement</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8 }}>{r.date}</td>
                <td style={{ padding: 8 }}>{r.supplierName}</td>
                <td style={{ padding: 8 }}>{r.billNumber}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{r.purchaseAmount?.toLocaleString()}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{r.settlementAmount?.toLocaleString()}</td>
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
        <div className="hint">Total Purchases: {totals.totalPurchases.toLocaleString()}</div>
        <div className="hint">Total Settlements: {totals.totalSettlements.toLocaleString()}</div>
        <div className="hint">Outstanding Balance: {totals.outstandingBalance.toLocaleString()}</div>
      </div>
    </div>
  )
}


