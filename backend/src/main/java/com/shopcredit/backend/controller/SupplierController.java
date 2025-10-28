package com.shopcredit.backend.controller;

import com.shopcredit.backend.domain.SupplierBill;
import com.shopcredit.backend.domain.SupplierSettlement;
import com.shopcredit.backend.dto.SupplierCreditRequest;
import com.shopcredit.backend.dto.SupplierSettlementRequest;
import com.shopcredit.backend.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping("/credit")
    public ResponseEntity<SupplierBill> createCredit(@Valid @RequestBody SupplierCreditRequest request) {
        return ResponseEntity.ok(supplierService.createCredit(request));
    }

    @PostMapping("/settlement")
    public ResponseEntity<SupplierSettlement> settle(@Valid @RequestBody SupplierSettlementRequest request) {
        return ResponseEntity.ok(supplierService.makeSettlement(request));
    }

    @GetMapping("/open-bills")
    public ResponseEntity<List<SupplierBill>> openBills(@RequestParam("name") String name) {
        return ResponseEntity.ok(supplierService.listOpenBills(name));
    }
}


