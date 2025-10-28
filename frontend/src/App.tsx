import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SupplierCreditForm from './components/SupplierCreditForm'
import SupplierSettlementForm from './components/SupplierSettlementForm'
import CustomerCreditForm from './components/CustomerCreditForm'
import CustomerPaymentForm from './components/CustomerPaymentForm'
import SupplierReportPage from './pages/SupplierReportPage'
import CustomerReportPage from './pages/CustomerReportPage'

export default function App() {
  return (
    <div>
      <nav className="topnav">
        <div className="brand">Shop Credit</div>
        <Link to="/supplier/credit">Supplier Credit</Link>
        <Link to="/supplier/settlement">Supplier Settlement</Link>
        <Link to="/customer/credit">Customer Credit</Link>
        <Link to="/customer/payment">Customer Payment</Link>
        <Link to="/reports/suppliers">Supplier Report</Link>
        <Link to="/reports/customers">Customer Report</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<div><h2 className="section-title">Home</h2><p className="hint">Choose a menu to get started.</p></div>} />
          <Route path="/supplier/credit" element={<SupplierCreditForm />} />
          <Route path="/supplier/settlement" element={<SupplierSettlementForm />} />
          <Route path="/customer/credit" element={<CustomerCreditForm />} />
          <Route path="/customer/payment" element={<CustomerPaymentForm />} />
          <Route path="/reports/suppliers" element={<SupplierReportPage />} />
          <Route path="/reports/customers" element={<CustomerReportPage />} />
        </Routes>
      </div>
    </div>
  )
}


