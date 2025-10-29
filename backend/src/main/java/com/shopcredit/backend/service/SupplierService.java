package com.shopcredit.backend.service;

import com.shopcredit.backend.domain.*;
import com.shopcredit.backend.dto.SupplierCreditRequest;
import com.shopcredit.backend.dto.SupplierSettlementRequest;
import com.shopcredit.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SupplierService {
    
    public List<String> searchSupplierNames(String query) {
        return supplierRepository.findByNameContainingIgnoreCase(query).stream()
                .map(Supplier::getName)
                .collect(java.util.stream.Collectors.toList());
    }
    private final SupplierRepository supplierRepository;
    private final SupplierBillRepository supplierBillRepository;
    private final SupplierSettlementRepository supplierSettlementRepository;

    public SupplierService(SupplierRepository supplierRepository,
                           SupplierBillRepository supplierBillRepository,
                           SupplierSettlementRepository supplierSettlementRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierBillRepository = supplierBillRepository;
        this.supplierSettlementRepository = supplierSettlementRepository;
    }

    @Transactional
    public SupplierBill createCredit(SupplierCreditRequest req) {
        Supplier supplier = supplierRepository.findByNameIgnoreCase(req.getName())
                .orElseGet(() -> {
                    Supplier s = new Supplier();
                    s.setName(req.getName());
                    s.setPhoneNumber(req.getPhoneNumber());
                    return supplierRepository.save(s);
                });

        supplierBillRepository.findBySupplierAndBillNumberIgnoreCase(supplier, req.getBillNumber())
                .ifPresent(sb -> { throw new IllegalArgumentException("Bill number already exists for this supplier"); });

        SupplierBill bill = new SupplierBill();
        bill.setSupplier(supplier);
        bill.setBillNumber(req.getBillNumber());
        bill.setDate(req.getDate());
        bill.setPurchaseAmount(req.getPurchaseAmount());
        bill.setBalance(req.getPurchaseAmount());
        bill.setGst(req.getGst());
        bill.setDescription(req.getDescription());
        bill.setClosed(false);
        return supplierBillRepository.save(bill);
    }

    @Transactional
    public SupplierSettlement makeSettlement(SupplierSettlementRequest req) {
        Supplier supplier = supplierRepository.findByNameIgnoreCase(req.getName())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        SupplierBill bill = supplierBillRepository.findBySupplierAndBillNumberIgnoreCase(supplier, req.getBillNumber())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found for supplier"));

        if (Boolean.TRUE.equals(bill.getClosed())) {
            throw new IllegalStateException("Bill already closed");
        }

        BigDecimal settlement = req.getSettlementAmount();
        if (settlement.compareTo(bill.getBalance()) > 0) {
            throw new IllegalArgumentException("Settlement exceeds balance");
        }

        bill.setBalance(bill.getBalance().subtract(settlement));
        if (bill.getBalance().compareTo(BigDecimal.ZERO) == 0) {
            bill.setClosed(true);
        }
        supplierBillRepository.save(bill);

        SupplierSettlement s = new SupplierSettlement();
        s.setBill(bill);
        s.setSettlementAmount(settlement);
        s.setDate(req.getDate());
        s.setDescription(req.getDescription());
        return supplierSettlementRepository.save(s);
    }

    @Transactional(readOnly = true)
    public List<SupplierBill> listOpenBills(String supplierName) {
        return supplierRepository.findByNameIgnoreCase(supplierName)
                .map(supplierBillRepository::findBySupplierAndClosedFalse)
                .orElseGet(java.util.List::of);
    }
}


