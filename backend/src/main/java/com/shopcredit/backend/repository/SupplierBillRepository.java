package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.SupplierBill;
import com.shopcredit.backend.domain.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierBillRepository extends JpaRepository<SupplierBill, Long> {
    List<SupplierBill> findBySupplierAndClosedFalse(Supplier supplier);
    Optional<SupplierBill> findBySupplierAndBillNumberIgnoreCase(Supplier supplier, String billNumber);
}


