package com.library.Library.entity;

import lombok.Data;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "checkout")
@Data
public class Checkout {

    public Checkout() {}

    public Checkout(String userEmail, String checkoutDate, String returnDate, Long bookId) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnDate = returnDate;
        this.bookId = bookId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    @Column(name = "user_email")
    private String userEmail;

    @NotBlank(message = "Checkout date is required")
    @Column(name = "checkout_date")
    private String checkoutDate;

    @NotBlank(message = "Return date is required")
    @Column(name = "return_date")
    private String returnDate;

    @NotNull(message = "Book ID is required")
    @Min(value = 1, message = "Book ID must be positive")
    @Column(name = "book_id")
    private Long bookId;
}
