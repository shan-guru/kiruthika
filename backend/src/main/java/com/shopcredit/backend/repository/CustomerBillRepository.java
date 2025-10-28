package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.CustomerBill;
import com.shopcredit.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerBillRepository extends JpaRepository<CustomerBill, Long> {
    List<CustomerBill> findByCustomer(Customer customer);
    Optional<CustomerBill> findByCustomerAndBillNumberIgnoreCase(Customer customer, String billNumber);
}


