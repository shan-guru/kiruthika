import React, { useEffect, useState, ChangeEvent } from 'react'
import api from '../api'
import Autocomplete from '../components/Autocomplete'

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
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 })

  const load = async () => {
    const params: any = {}
    if (filters.name) params.name = filters.name
    if (filters.billNumber) params.billNumber = filters.billNumber
    if (filters.start) params.start = filters.start
    if (filters.end) params.end = filters.end
      params.page = pagination.page
      params.size = pagination.size

    const res = await api.get('/api/reports/suppliers', { params })
    setRows(res.data.items || [])
    setPagination(prev => ({ ...prev, totalPages: res.data.totalPages || 1 }))
    setTotals({
      totalPurchases: Number(res.data.totalPurchases || 0),
      totalSettlements: Number(res.data.totalSettlements || 0),
      outstandingBalance: Number(res.data.outstandingBalance || 0)
    })
  }

    const exportToExcel = async () => {
      const params: any = {}
      if (filters.name) params.name = filters.name
      if (filters.billNumber) params.billNumber = filters.billNumber
      if (filters.start) params.start = filters.start
      if (filters.end) params.end = filters.end

      try {
        const response = await api.get('/api/reports/suppliers/excel', {
          params,
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'supplier-report.xlsx')
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
      <h2 className="section-title">Supplier Report</h2>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="col-4">
          <label>Supplier</label>
          <Autocomplete
            value={filters.name}
            onChange={(value) => setFilters({ ...filters, name: value })}
            onSelect={(value) => setFilters({ ...filters, name: value })}
            endpoint="suppliers"
            placeholder="Enter supplier name"
          />
        </div>
        <div className="col-4"><label>Bill Number</label><input value={filters.billNumber} onChange={e => setFilters({ ...filters, billNumber: e.target.value })} /></div>
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
        <div className="hint">Total Purchases: {totals.totalPurchases.toLocaleString()}</div>
        <div className="hint">Total Settlements: {totals.totalSettlements.toLocaleString()}</div>
        <div className="hint">Outstanding Balance: {totals.outstandingBalance.toLocaleString()}</div>
      </div>
    </div>
  )
}


