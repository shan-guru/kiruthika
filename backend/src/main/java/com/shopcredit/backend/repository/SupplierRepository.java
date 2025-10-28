package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByNameIgnoreCase(String name);
    List<Supplier> findByNameContainingIgnoreCase(String q);
}


