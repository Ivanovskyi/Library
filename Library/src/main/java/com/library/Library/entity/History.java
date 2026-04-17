package com.library.Library.entity;

import lombok.Data;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "History")
@Data
public class History {

    public History(){}

    public History(String userEmail, String checkoutDate, String returnedDate, String title,
                   String author, String description, String img) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    @Column(name="user_email")
    private String userEmail;

    @NotBlank(message = "Checkout date is required")
    @Column(name="checkout_date")
    private String checkoutDate;

    @NotBlank(message = "Returned date is required")
    @Column(name="returned_date")
    private String returnedDate;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(name="title")
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author must be less than 255 characters")
    @Column(name="author")
    private String author;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    @Column(name="description", length = 1000)
    private String description;

    @Column(name="img", columnDefinition = "LONGTEXT")
    private String img;
}












