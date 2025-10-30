package com.shopcredit.backend.service;

import com.shopcredit.backend.domain.*;
import com.shopcredit.backend.dto.ReportDtos.*;
import com.shopcredit.backend.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {
    private final SupplierRepository supplierRepository;
    private final SupplierBillRepository supplierBillRepository;
    private final SupplierSettlementRepository supplierSettlementRepository;
    private final CustomerRepository customerRepository;
    private final CustomerBillRepository customerBillRepository;
    private final CustomerPaymentRepository customerPaymentRepository;

    public ReportService(SupplierRepository supplierRepository,
                         SupplierBillRepository supplierBillRepository,
                         SupplierSettlementRepository supplierSettlementRepository,
                         CustomerRepository customerRepository,
                         CustomerBillRepository customerBillRepository,
                         CustomerPaymentRepository customerPaymentRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierBillRepository = supplierBillRepository;
        this.supplierSettlementRepository = supplierSettlementRepository;
        this.customerRepository = customerRepository;
        this.customerBillRepository = customerBillRepository;
        this.customerPaymentRepository = customerPaymentRepository;
    }

    @Transactional(readOnly = true)
        public SupplierReportResponse supplierReport(String supplierName, String billNumber, String gst, LocalDate start, LocalDate end, PageRequest pageRequest) {
        List<SupplierReportItem> items = new ArrayList<>();
        BigDecimal totalPurchases = BigDecimal.ZERO;
        BigDecimal totalSettlements = BigDecimal.ZERO;

        List<SupplierBill> allBills;
        if (supplierName != null && !supplierName.isBlank()) {
            var supplierOpt = supplierRepository.findByNameIgnoreCase(supplierName);
            if (supplierOpt.isEmpty()) {
                SupplierReportResponse resp = new SupplierReportResponse();
                resp.items = List.of();
                resp.totalPurchases = BigDecimal.ZERO;
                resp.totalSettlements = BigDecimal.ZERO;
                resp.outstandingBalance = BigDecimal.ZERO;
                resp.totalPages = 0;
                return resp;
            }
            Supplier supplier = supplierOpt.get();
            allBills = supplierBillRepository.findBySupplierAndClosedFalse(supplier);
        } else {
            allBills = supplierBillRepository.findAll();
        }

        // Apply date, bill number and GST filters
        List<SupplierBill> filteredBills = allBills.stream()
            .filter(b -> billNumber == null || billNumber.isBlank() || billNumber.equalsIgnoreCase(b.getBillNumber()))
            .filter(b -> gst == null || gst.isBlank() || (b.getGst() != null && b.getGst().toLowerCase().contains(gst.toLowerCase())))
            .filter(b -> start == null || !b.getDate().isBefore(start))
            .filter(b -> end == null || !b.getDate().isAfter(end))
            .toList();

        // Calculate total pages
        int totalPages = (int) Math.ceil((double) filteredBills.size() / pageRequest.getPageSize());

        // Apply pagination
        int start_idx = (int) pageRequest.getOffset();
        int end_idx = Math.min((start_idx + pageRequest.getPageSize()), filteredBills.size());
        List<SupplierBill> bills = filteredBills.subList(start_idx, end_idx);

        for (SupplierBill b : bills) {
            if (billNumber != null && !billNumber.isBlank() && !billNumber.equalsIgnoreCase(b.getBillNumber())) continue;
            if (start != null && b.getDate().isBefore(start)) continue;
            if (end != null && b.getDate().isAfter(end)) continue;

            SupplierReportItem row = new SupplierReportItem();
            row.date = b.getDate();
            row.supplierName = b.getSupplier().getName();
            row.billNumber = b.getBillNumber();
            row.gst = b.getGst();
            row.purchaseAmount = b.getPurchaseAmount();

            BigDecimal settlements = supplierSettlementRepository.findByBill(b).stream()
                    .map(SupplierSettlement::getSettlementAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            row.settlementAmount = settlements;
            row.balance = b.getPurchaseAmount().subtract(settlements);

            totalPurchases = totalPurchases.add(row.purchaseAmount);
            totalSettlements = totalSettlements.add(settlements);
            items.add(row);
        }

        SupplierReportResponse resp = new SupplierReportResponse();
        resp.items = items;
        resp.totalPurchases = totalPurchases;
        resp.totalSettlements = totalSettlements;
        resp.outstandingBalance = totalPurchases.subtract(totalSettlements);
        resp.totalPages = totalPages;
        return resp;
    }

    @Transactional(readOnly = true)
        public CustomerReportResponse customerReport(String customerName, LocalDate start, LocalDate end, PageRequest pageRequest) {
        List<CustomerReportItem> items = new ArrayList<>();
        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal totalPayments = BigDecimal.ZERO;

        List<CustomerBill> allBills;
        if (customerName != null && !customerName.isBlank()) {
            var custOpt = customerRepository.findByNameIgnoreCase(customerName);
            if (custOpt.isEmpty()) {
                CustomerReportResponse resp = new CustomerReportResponse();
                resp.items = List.of();
                resp.totalSales = BigDecimal.ZERO;
                resp.totalPayments = BigDecimal.ZERO;
                resp.outstandingReceivables = BigDecimal.ZERO;
                resp.totalPages = 0;
                return resp;
            }
            allBills = customerBillRepository.findByCustomer(custOpt.get());
        } else {
            allBills = customerBillRepository.findAll();
        }

        // Apply date filters
        List<CustomerBill> filteredBills = allBills.stream()
            .filter(b -> start == null || !b.getDate().isBefore(start))
            .filter(b -> end == null || !b.getDate().isAfter(end))
            .toList();

        // Calculate total pages
        int totalPages = pageRequest != null ? (int) Math.ceil((double) filteredBills.size() / pageRequest.getPageSize()) : 1;

        // Apply pagination if pageRequest is provided
        List<CustomerBill> bills;
        if (pageRequest != null) {
            int start_idx = (int) pageRequest.getOffset();
            int end_idx = Math.min((start_idx + pageRequest.getPageSize()), filteredBills.size());
            bills = filteredBills.subList(start_idx, end_idx);
        } else {
            bills = filteredBills;
        }

        for (CustomerBill b : bills) {
            if (start != null && b.getDate().isBefore(start)) continue;
            if (end != null && b.getDate().isAfter(end)) continue;

            CustomerReportItem row = new CustomerReportItem();
            row.date = b.getDate();
            row.customerName = b.getCustomer().getName();
            row.billNumber = b.getBillNumber();
            row.purchaseAmount = b.getPurchaseAmount();

            BigDecimal payments = customerPaymentRepository.findByCustomer(b.getCustomer()).stream()
                    .filter(p -> !p.getDate().isBefore(start == null ? LocalDate.MIN : start) && !p.getDate().isAfter(end == null ? LocalDate.MAX : end))
                    .map(CustomerPayment::getPaymentAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            row.paymentAmount = payments;
            row.balance = row.purchaseAmount.subtract(payments);

            totalSales = totalSales.add(row.purchaseAmount);
            totalPayments = totalPayments.add(payments);
            items.add(row);
        }

        CustomerReportResponse resp = new CustomerReportResponse();
        resp.items = items;
        resp.totalSales = totalSales;
        resp.totalPayments = totalPayments;
        resp.outstandingReceivables = totalSales.subtract(totalPayments);
        resp.totalPages = totalPages;
        return resp;
    }
}


