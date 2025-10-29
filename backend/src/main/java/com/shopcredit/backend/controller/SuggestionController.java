package com.shopcredit.backend.controller;

import com.shopcredit.backend.service.CustomerService;
import com.shopcredit.backend.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@CrossOrigin
public class SuggestionController {

    private final SupplierService supplierService;
    private final CustomerService customerService;

    public SuggestionController(SupplierService supplierService, CustomerService customerService) {
        this.supplierService = supplierService;
        this.customerService = customerService;
    }

    @GetMapping("/suppliers")
    public List<String> getSupplierSuggestions(@RequestParam String query) {
        return supplierService.searchSupplierNames(query);
    }

    @GetMapping("/customers")
    public List<String> getCustomerSuggestions(@RequestParam String query) {
        return customerService.searchCustomerNames(query);
    }
}
