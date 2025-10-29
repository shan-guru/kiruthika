import React, { useEffect, useState } from 'react'
import api from '../api'
import Autocomplete from './Autocomplete'

const INITIAL_STATE = {
  name: '',
  billNumber: '',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  description: ''
}

export default function SupplierSettlementForm() {
  const [form, setForm] = useState(INITIAL_STATE)
  const [openBills, setOpenBills] = useState<{ billNumber: string, balance: number }[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setStatus(null)
      setForm(prev => ({ ...prev, billNumber: '' }))
      setBalance(null)
      const q = form.name.trim()
      if (!q) return
      try {
        const res = await api.get('/api/suppliers/open-bills', { params: { name: q } })
        const items = (res.data || []).map((b: any) => ({ billNumber: b.billNumber, balance: Number(b.balance) }))
        setOpenBills(items)
      } catch {
        setOpenBills([])
      }
    }
    fetch()
  }, [form.name])

  useEffect(() => {
    const selected = openBills.find(b => b.billNumber === form.billNumber)
    setBalance(selected ? selected.balance : null)
  }, [form.billNumber, openBills])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await api.post('/api/suppliers/settlement', {
        name: form.name,
        billNumber: form.billNumber,
        settlementAmount: Number(form.amount || 0),
        date: form.date,
        description: form.description
      })
      setForm(INITIAL_STATE)
      setStatus('Saved')
    } catch (err: any) {
      setStatus(err?.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Supplier Settlement</h2>
      <form onSubmit={submit} className="form">
        <div className="form-grid">
          <div className="col-6">
            <label>Name*</label>
            <Autocomplete
              value={form.name}
              onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
              onSelect={(value) => setForm(prev => ({ ...prev, name: value }))}
              endpoint="suppliers"
              required={true}
              placeholder="Enter supplier name"
            />
          </div>
          <div className="col-6">
            <label>Bill Number*</label>
            <select
              value={form.billNumber}
              onChange={e => setForm(prev => ({ ...prev, billNumber: e.target.value }))}
              required
            >
              <option value="">--select--</option>
              {openBills.map(b => (
                <option key={b.billNumber} value={b.billNumber}>{b.billNumber}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label>Balance</label>
            <input value={balance ?? ''} readOnly />
          </div>
          <div className="col-6">
            <label>Settlement Amount*</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>
          <div className="col-6">
            <label>Date*</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div className="col-12">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn btn-ghost" type="button" onClick={() => setForm(INITIAL_STATE)}>Clear</button>
        </div>
        {status && <p className={`status ${status === 'Saved' ? 'ok' : 'err'}`}>{status}</p>}
      </form>
    </div>
  )
}