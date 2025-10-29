import React, { useEffect, useState } from 'react'
import api from '../api'
import Autocomplete from './Autocomplete'

export default function CustomerPaymentForm() {
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setBalance(null)
      if (!name) return
      try {
        const res = await api.get('/api/customers/balance', { params: { name } })
        setBalance(Number(res.data))
      } catch {
        setBalance(null)
      }
    }
    fetch()
  }, [name])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await api.post('/api/customers/payment', {
        name,
        paymentAmount: Number(amount || 0),
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
      <h2 className="section-title">Customer Payment</h2>
      <form onSubmit={submit} className="form">
        <div className="form-grid">
          <div className="col-6">
            <label>Name*</label>
            <Autocomplete
              value={name}
              onChange={setName}
              onSelect={setName}
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
          <button className="btn btn-ghost" type="reset" onClick={() => { setAmount(''); setDescription(''); }}>Clear</button>
        </div>
        {status && <p className={`status ${status === 'Saved' ? 'ok' : 'err'}`}>{status}</p>}
      </form>
    </div>
  )
}


