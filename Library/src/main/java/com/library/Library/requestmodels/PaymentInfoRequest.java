package com.library.Library.requestmodels;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class PaymentInfoRequest {

    @Min(value = 1, message = "Amount must be positive")
    private int amount;
    
    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be 3 uppercase letters")
    private String currency;
    
    @NotBlank(message = "Receipt email is required")
    @Email(message = "Invalid email format")
    private String receiptEmail;
}
