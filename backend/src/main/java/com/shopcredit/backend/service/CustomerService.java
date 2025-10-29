package com.shopcredit.backend.service;

import com.shopcredit.backend.domain.*;
import com.shopcredit.backend.dto.CustomerCreditRequest;
import com.shopcredit.backend.dto.CustomerPaymentRequest;
import com.shopcredit.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CustomerService {
    
    public List<String> searchCustomerNames(String query) {
        return customerRepository.findByNameContainingIgnoreCase(query).stream()
                .map(Customer::getName)
                .collect(java.util.stream.Collectors.toList());
    }
    private final CustomerRepository customerRepository;
    private final CustomerBillRepository customerBillRepository;
    private final CustomerPaymentRepository customerPaymentRepository;

    public CustomerService(CustomerRepository customerRepository,
                           CustomerBillRepository customerBillRepository,
                           CustomerPaymentRepository customerPaymentRepository) {
        this.customerRepository = customerRepository;
        this.customerBillRepository = customerBillRepository;
        this.customerPaymentRepository = customerPaymentRepository;
    }

    @Transactional
    public CustomerBill createCredit(CustomerCreditRequest req) {
        Customer customer = customerRepository.findByNameIgnoreCase(req.getName())
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setName(req.getName());
                    c.setPhoneNumber(req.getPhoneNumber());
                    return customerRepository.save(c);
                });

        customerBillRepository.findByCustomerAndBillNumberIgnoreCase(customer, req.getBillNumber())
                .ifPresent(cb -> { throw new IllegalArgumentException("Bill number already exists for this customer"); });

        CustomerBill bill = new CustomerBill();
        bill.setCustomer(customer);
        bill.setBillNumber(req.getBillNumber());
        bill.setDate(req.getDate());
        bill.setPurchaseAmount(req.getPurchaseAmount());
        bill.setGst(req.getGst());
        bill.setDescription(req.getDescription());
        return customerBillRepository.save(bill);
    }

    @Transactional
    public CustomerPayment makePayment(CustomerPaymentRequest req) {
        Customer customer = customerRepository.findByNameIgnoreCase(req.getName())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerPayment p = new CustomerPayment();
        p.setCustomer(customer);
        p.setPaymentAmount(req.getPaymentAmount());
        p.setDate(req.getDate());
        p.setDescription(req.getDescription());
        return customerPaymentRepository.save(p);
    }

    @Transactional(readOnly = true)
    public BigDecimal getCustomerBalance(String customerName) {
        Customer customer = customerRepository.findByNameIgnoreCase(customerName)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        BigDecimal purchases = customerBillRepository.findByCustomer(customer).stream()
                .map(CustomerBill::getPurchaseAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal payments = customerPaymentRepository.findByCustomer(customer).stream()
                .map(CustomerPayment::getPaymentAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return purchases.subtract(payments);
    }
}


