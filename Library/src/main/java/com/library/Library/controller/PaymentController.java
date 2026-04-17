package com.library.Library.controller;

import com.library.Library.requestmodels.PaymentInfoRequest;
import com.library.Library.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/payment/secure")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@Valid @RequestBody PaymentInfoRequest paymentInfoRequest)
            throws StripeException {

        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
        String paymentStr = paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<Double> getCurrentPayment(Authentication authentication) {
        String userEmail = authentication.getName();
        Double amount = paymentService.getCurrentPaymentAmount(userEmail);
        return ResponseEntity.ok(amount);
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(Authentication authentication) {

        String userEmail = authentication.getName();
        return paymentService.stripePayment(userEmail);
    }
}