package com.shopcredit.backend.controller;

import com.shopcredit.backend.dto.ReportDtos.CustomerReportResponse;
import com.shopcredit.backend.dto.ReportDtos.SupplierReportResponse;
import com.shopcredit.backend.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

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
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(reportService.supplierReport(supplierName, billNumber, start, end, PageRequest.of(page, size)));
    }

    @GetMapping("/customers")
    public ResponseEntity<CustomerReportResponse> customerReport(
            @RequestParam(value = "name", required = false) String customerName,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(reportService.customerReport(customerName, start, end, PageRequest.of(page, size)));
    }

    @GetMapping("/suppliers/excel")
    public ResponseEntity<byte[]> exportSupplierReport(
            @RequestParam(value = "name", required = false) String supplierName,
            @RequestParam(value = "billNumber", required = false) String billNumber,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) throws IOException {
        
        SupplierReportResponse report = reportService.supplierReport(supplierName, billNumber, start, end, null);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Supplier Report");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("Supplier");
            headerRow.createCell(2).setCellValue("Bill Number");
            headerRow.createCell(3).setCellValue("Purchase Amount");
            headerRow.createCell(4).setCellValue("Settlement Amount");
            headerRow.createCell(5).setCellValue("Balance");
            
            // Create data rows
            int rowNum = 1;
            for (var item : report.items) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(item.date.toString());
                row.createCell(1).setCellValue(item.supplierName);
                row.createCell(2).setCellValue(item.billNumber);
                row.createCell(3).setCellValue(item.purchaseAmount.doubleValue());
                row.createCell(4).setCellValue(item.settlementAmount.doubleValue());
                row.createCell(5).setCellValue(item.balance.doubleValue());
            }
            
            // Add totals
            Row totalRow = sheet.createRow(rowNum + 1);
            totalRow.createCell(0).setCellValue("Totals");
            totalRow.createCell(3).setCellValue(report.totalPurchases.doubleValue());
            totalRow.createCell(4).setCellValue(report.totalSettlements.doubleValue());
            totalRow.createCell(5).setCellValue(report.outstandingBalance.doubleValue());
            
            // Set column widths manually (in units of 1/256th of a character width)
            sheet.setColumnWidth(0, 15 * 256); // Date
            sheet.setColumnWidth(1, 30 * 256); // Supplier name
            sheet.setColumnWidth(2, 20 * 256); // Bill number
            sheet.setColumnWidth(3, 20 * 256); // Purchase amount
            sheet.setColumnWidth(4, 20 * 256); // Settlement amount
            sheet.setColumnWidth(5, 20 * 256); // Balance
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "supplier-report.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
        }
    }
    
    @GetMapping("/customers/excel")
    public ResponseEntity<byte[]> exportCustomerReport(
            @RequestParam(value = "name", required = false) String customerName,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) throws IOException {
        
        CustomerReportResponse report = reportService.customerReport(customerName, start, end, null);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Customer Report");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Date");
            headerRow.createCell(1).setCellValue("Customer");
            headerRow.createCell(2).setCellValue("Bill Number");
            headerRow.createCell(3).setCellValue("Purchase Amount");
            headerRow.createCell(4).setCellValue("Payment Amount");
            headerRow.createCell(5).setCellValue("Balance");
            
            // Create data rows
            int rowNum = 1;
            for (var item : report.items) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(item.date.toString());
                row.createCell(1).setCellValue(item.customerName);
                row.createCell(2).setCellValue(item.billNumber);
                row.createCell(3).setCellValue(item.purchaseAmount.doubleValue());
                row.createCell(4).setCellValue(item.paymentAmount.doubleValue());
                row.createCell(5).setCellValue(item.balance.doubleValue());
            }
            
            // Add totals
            Row totalRow = sheet.createRow(rowNum + 1);
            totalRow.createCell(0).setCellValue("Totals");
            totalRow.createCell(3).setCellValue(report.totalSales.doubleValue());
            totalRow.createCell(4).setCellValue(report.totalPayments.doubleValue());
            totalRow.createCell(5).setCellValue(report.outstandingReceivables.doubleValue());
            
            // Set column widths manually (in units of 1/256th of a character width)
            sheet.setColumnWidth(0, 15 * 256); // Date
            sheet.setColumnWidth(1, 30 * 256); // Customer name
            sheet.setColumnWidth(2, 20 * 256); // Bill number
            sheet.setColumnWidth(3, 20 * 256); // Purchase amount
            sheet.setColumnWidth(4, 20 * 256); // Payment amount
            sheet.setColumnWidth(5, 20 * 256); // Balance
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "customer-report.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
        }
    }
}
