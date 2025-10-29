import React, { useEffect, useState } from 'react'
import api from '../api'
import Autocomplete from '../components/Autocomplete'

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
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 })

  const load = async () => {
    const params: any = {}
    if (filters.name) params.name = filters.name
    if (filters.start) params.start = filters.start
    if (filters.end) params.end = filters.end
      params.page = pagination.page
      params.size = pagination.size

    const res = await api.get('/api/reports/customers', { params })
    setRows(res.data.items || [])
    setPagination(prev => ({ ...prev, totalPages: res.data.totalPages || 1 }))
    setTotals({
      totalSales: Number(res.data.totalSales || 0),
      totalPayments: Number(res.data.totalPayments || 0),
      outstandingReceivables: Number(res.data.outstandingReceivables || 0)
    })
  }

    const exportToExcel = async () => {
      const params: any = {}
      if (filters.name) params.name = filters.name
      if (filters.start) params.start = filters.start
      if (filters.end) params.end = filters.end

      try {
        const response = await api.get('/api/reports/customers/excel', {
          params,
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'customer-report.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        console.error('Failed to download excel:', error)
        alert('Failed to download excel report')
      }
    }
  useEffect(() => { load() }, [filters, pagination.page])

  return (
    <div className="card">
      <h2 className="section-title">Customer Report</h2>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="col-4">
          <label>Customer</label>
          <Autocomplete
            value={filters.name}
            onChange={(value) => setFilters({ ...filters, name: value })}
            onSelect={(value) => setFilters({ ...filters, name: value })}
            endpoint="customers"
            placeholder="Enter customer name"
          />
        </div>
        <div className="col-4"><label>Start</label><input type="date" value={filters.start} onChange={e => setFilters({ ...filters, start: e.target.value })} /></div>
        <div className="col-4"><label>End</label><input type="date" value={filters.end} onChange={e => setFilters({ ...filters, end: e.target.value })} /></div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={load}>Generate</button>
          <button className="btn btn-secondary" onClick={exportToExcel}>Export to Excel</button>
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
         <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
           <button 
             className="btn btn-secondary" 
             disabled={pagination.page === 0} 
             onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
           >
             Previous
           </button>
           <span style={{ lineHeight: '32px' }}>Page {pagination.page + 1}</span>
           <button 
             className="btn btn-secondary" 
             disabled={pagination.page >= pagination.totalPages - 1} 
             onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
           >
             Next
           </button>
         </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
        <div className="hint">Total Sales: {totals.totalSales.toLocaleString()}</div>
        <div className="hint">Total Payments: {totals.totalPayments.toLocaleString()}</div>
        <div className="hint">Outstanding Receivables: {totals.outstandingReceivables.toLocaleString()}</div>
      </div>
    </div>
  )
}


