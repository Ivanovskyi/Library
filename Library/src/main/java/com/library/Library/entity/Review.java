package com.library.Library.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
@Table(name = "review")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private Date date;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5.0")
    @Column(name = "rating")
    private double rating;

    @NotNull(message = "Book ID is required")
    @Min(value = 1, message = "Book ID must be positive")
    @Column(name = "book_id")
    private Long bookId;

    @Size(max = 1000, message = "Review description must be less than 1000 characters")
    @Column(name = "review_description")
    private String reviewDescription;










}
