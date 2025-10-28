package com.shopcredit.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SupplierSettlementRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String billNumber;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal settlementAmount;

    @NotNull
    private LocalDate date;

    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }
    public BigDecimal getSettlementAmount() { return settlementAmount; }
    public void setSettlementAmount(BigDecimal settlementAmount) { this.settlementAmount = settlementAmount; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}


