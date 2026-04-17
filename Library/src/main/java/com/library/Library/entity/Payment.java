package com.library.Library.entity;

import lombok.Data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    @Column(name="user_email")
    private String userEmail;

    @Min(value = 0, message = "Amount cannot be negative")
    @Column(name = "amount")
    private double amount;
}
