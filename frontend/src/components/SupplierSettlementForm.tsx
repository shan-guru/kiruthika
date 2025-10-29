import React, { useEffect, useState } from 'react'
import api from '../api'
import Autocomplete from './Autocomplete'

export default function SupplierSettlementForm() {
  const [name, setName] = useState('')
  const [billNumber, setBillNumber] = useState('')
  const [openBills, setOpenBills] = useState<{ billNumber: string, balance: number }[]>([])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setStatus(null)
      setBillNumber('')
      setBalance(null)
      const q = name.trim()
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
  }, [name])

  useEffect(() => {
    const selected = openBills.find(b => b.billNumber === billNumber)
    setBalance(selected ? selected.balance : null)
  }, [billNumber, openBills])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await api.post('/api/suppliers/settlement', {
        name,
        billNumber,
        settlementAmount: Number(amount || 0),
        date,
        description
      })
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
              value={name}
              onChange={setName}
              onSelect={setName}
              endpoint="suppliers"
              required={true}
              placeholder="Enter supplier name"
            />
          </div>
          <div className="col-6">
            <label>Bill Number*</label>
            <select value={billNumber} onChange={e => setBillNumber(e.target.value)} required>
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
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div className="col-6">
            <label>Date*</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="col-12">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn btn-ghost" type="reset" onClick={() => { setBillNumber(''); setAmount(''); setDescription(''); }}>Clear</button>
        </div>
        {status && <p className={`status ${status === 'Saved' ? 'ok' : 'err'}`}>{status}</p>}
      </form>
    </div>
  )
}


