package com.shopcredit.backend.controller;

import com.shopcredit.backend.domain.CustomerBill;
import com.shopcredit.backend.domain.CustomerPayment;
import com.shopcredit.backend.dto.CustomerCreditRequest;
import com.shopcredit.backend.dto.CustomerPaymentRequest;
import com.shopcredit.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/credit")
    public ResponseEntity<CustomerBill> createCredit(@Valid @RequestBody CustomerCreditRequest request) {
        return ResponseEntity.ok(customerService.createCredit(request));
    }

    @PostMapping("/payment")
    public ResponseEntity<CustomerPayment> makePayment(@Valid @RequestBody CustomerPaymentRequest request) {
        return ResponseEntity.ok(customerService.makePayment(request));
    }

    @GetMapping("/balance")
    public ResponseEntity<BigDecimal> getBalance(@RequestParam("name") String name) {
        return ResponseEntity.ok(customerService.getCustomerBalance(name));
    }
}


