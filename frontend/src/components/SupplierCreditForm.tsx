import React, { useState } from 'react'
import api from '../api'
import Autocomplete from './Autocomplete'

export default function SupplierCreditForm() {
  const [form, setForm] = useState({
    name: '', billNumber: '', phoneNumber: '', gst: '',
    date: new Date().toISOString().slice(0, 10), purchaseAmount: '', description: ''
  })
  const [status, setStatus] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      await api.post('/api/suppliers/credit', {
        ...form,
        purchaseAmount: Number(form.purchaseAmount || 0)
      })
      setStatus('Saved')
    } catch (err: any) {
      setStatus(err?.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Supplier Credit</h2>
      <form onSubmit={onSubmit} className="form">
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
            <input name="billNumber" value={form.billNumber} onChange={onChange} required />
          </div>
          <div className="col-6">
            <label>Phone</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
          </div>
          <div className="col-6">
            <label>GST</label>
            <input name="gst" value={form.gst} onChange={onChange} />
          </div>
          <div className="col-6">
            <label>Date*</label>
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div className="col-6">
            <label>Purchase Amount*</label>
            <input type="number" step="0.01" name="purchaseAmount" value={form.purchaseAmount} onChange={onChange} required />
          </div>
          <div className="col-12">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn btn-ghost" type="reset" onClick={() => setForm({ ...form, name: '', billNumber: '', phoneNumber: '', gst: '', purchaseAmount: '', description: '' })}>Clear</button>
        </div>
        {status && <p className={`status ${status === 'Saved' ? 'ok' : 'err'}`}>{status}</p>}
      </form>
    </div>
  )
}


