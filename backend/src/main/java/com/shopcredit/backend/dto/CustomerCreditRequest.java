package com.shopcredit.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CustomerCreditRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String billNumber;

    private String phoneNumber;
    private String gst;

    @NotNull
    private LocalDate date;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal purchaseAmount;

    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getGst() { return gst; }
    public void setGst(String gst) { this.gst = gst; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getPurchaseAmount() { return purchaseAmount; }
    public void setPurchaseAmount(BigDecimal purchaseAmount) { this.purchaseAmount = purchaseAmount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}


