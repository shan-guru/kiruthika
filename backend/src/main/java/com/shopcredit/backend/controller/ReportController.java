package com.shopcredit.backend.controller;

import com.shopcredit.backend.dto.ReportDtos.CustomerReportResponse;
import com.shopcredit.backend.dto.ReportDtos.SupplierReportResponse;
import com.shopcredit.backend.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/suppliers")
    public ResponseEntity<SupplierReportResponse> supplierReport(
            @RequestParam(value = "name", required = false) String supplierName,
            @RequestParam(value = "billNumber", required = false) String billNumber,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(reportService.supplierReport(supplierName, billNumber, start, end));
    }

    @GetMapping("/customers")
    public ResponseEntity<CustomerReportResponse> customerReport(
            @RequestParam(value = "name", required = false) String customerName,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(reportService.customerReport(customerName, start, end));
    }
}


