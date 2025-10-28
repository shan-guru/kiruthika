package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByNameIgnoreCase(String name);
    List<Customer> findByNameContainingIgnoreCase(String q);
}


