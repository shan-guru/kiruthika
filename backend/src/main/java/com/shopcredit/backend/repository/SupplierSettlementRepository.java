package com.shopcredit.backend.repository;

import com.shopcredit.backend.domain.SupplierSettlement;
import com.shopcredit.backend.domain.SupplierBill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierSettlementRepository extends JpaRepository<SupplierSettlement, Long> {
    List<SupplierSettlement> findByBill(SupplierBill bill);
}


