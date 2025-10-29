import React, { useEffect, useState } from 'react'
import api from '../api'
import Autocomplete from './Autocomplete'

const INITIAL_STATE = {
  name: '',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  description: ''
}

export default function CustomerPaymentForm() {
  const [form, setForm] = useState(INITIAL_STATE)
  const [balance, setBalance] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setBalance(null)
      if (!form.name) return
      try {
        const res = await api.get('/api/customers/balance', { params: { name: form.name } })
        setBalance(Number(res.data))
      } catch {
        setBalance(null)
      }
    }
    fetch()
  }, [form.name])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await api.post('/api/customers/payment', {
        name: form.name,
        paymentAmount: Number(form.amount || 0),
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
      <h2 className="section-title">Customer Payment</h2>
      <form onSubmit={submit} className="form">
        <div className="form-grid">
          <div className="col-6">
            <label>Name*</label>
            <Autocomplete
              value={form.name}
              onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
              onSelect={(value) => setForm(prev => ({ ...prev, name: value }))}
              endpoint="customers"
              required={true}
              placeholder="Enter customer name"
            />
          </div>
          <div className="col-6">
            <label>Balance</label>
            <input value={balance ?? ''} readOnly />
          </div>
          <div className="col-6">
            <label>Payment Amount*</label>
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