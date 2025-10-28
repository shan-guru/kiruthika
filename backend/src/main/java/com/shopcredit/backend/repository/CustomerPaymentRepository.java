package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.CustomerPayment;
import com.shopcredit.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Long> {
    List<CustomerPayment> findByCustomer(Customer customer);
}


