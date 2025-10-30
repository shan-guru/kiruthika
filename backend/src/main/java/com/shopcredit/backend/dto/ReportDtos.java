package com.shopcredit.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ReportDtos {
    public static class SupplierReportItem {
        public LocalDate date;
        public String supplierName;
        public String billNumber;
        public String gst;
        public BigDecimal purchaseAmount;
        public BigDecimal settlementAmount;
        public BigDecimal balance;
    }

    public static class SupplierReportResponse {
        public List<SupplierReportItem> items;
        public BigDecimal totalPurchases;
        public BigDecimal totalSettlements;
        public BigDecimal outstandingBalance;
        public int totalPages;
    }

    public static class CustomerReportItem {
        public LocalDate date;
        public String customerName;
        public String billNumber;
        public BigDecimal purchaseAmount;
        public BigDecimal paymentAmount;
        public BigDecimal balance;
    }

    public static class CustomerReportResponse {
        public List<CustomerReportItem> items;
        public BigDecimal totalSales;
        public BigDecimal totalPayments;
        public BigDecimal outstandingReceivables;
        public int totalPages;
    }
}


