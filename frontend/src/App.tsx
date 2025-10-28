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
        <div className="brand">Kiruthika Textiles</div>
        <Link to="/supplier/credit">Supplier Credit</Link>
        <Link to="/supplier/settlement">Supplier Settlement</Link>
        <Link to="/customer/credit">Customer Credit</Link>
        <Link to="/customer/payment">Customer Payment</Link>
        <Link to="/reports/suppliers">Supplier Report</Link>
        <Link to="/reports/customers">Customer Report</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <div className="card">
              <h2 className="section-title">Welcome to Kiruthika Textiles</h2>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWEyMTQyIi8+CiAgICA8dGV4dCB4PSI0MDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZTdlYWY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5LaXJ1dGhpa2EgVGV4dGlsZXM8L3RleHQ+CiAgICA8dGV4dCB4PSI0MDAiIHk9IjIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjYjViZGRiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RdWFsaXR5IFRleHRpbGVzICZhbXA7IEZhYnJpY3M8L3RleHQ+CiAgICA8cmVjdCB4PSIyMDAiIHk9IjI1MCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0IiBmaWxsPSIjNWI4Y2ZmIi8+Cjwvc3ZnPg==" 
                  alt="Kiruthika Textile Shop" 
                  style={{ 
                    maxWidth: '800px', 
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    marginBottom: '20px',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.1em', color: 'var(--text)', marginBottom: '20px' }}>
                  Welcome to Kiruthika Textiles, your premier destination for quality fabrics and textile products. 
                  We specialize in providing a wide range of textiles for all your needs, from traditional to modern designs.
                </p>
                <p className="hint">
                  Use the navigation menu above to manage supplier credits, customer accounts, and view reports.
                </p>
              </div>
            </div>
          } />
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


