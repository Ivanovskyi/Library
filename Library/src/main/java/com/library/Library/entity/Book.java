package com.library.Library.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.persistence.Id;

@Entity
@Table(name = "book")
@Data
public class Book {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(name = "title", length = 255)
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author must be less than 255 characters")
    @Column(name = "author", length = 255)
    private String author;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    @Column(name = "description", length = 1000)
    private String description;

    @Min(value = 1, message = "Copies must be at least 1")
    @Column(name = "copies")
    private int copies;

    @Min(value = 0, message = "Available copies cannot be negative")
    @Column(name = "copies_available")
    private int copiesAvailable;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be less than 100 characters")
    @Column(name = "category", length = 100)
    private String category;

    @NotBlank(message = "Image URL is required")
    @Column(name = "img", columnDefinition = "LONGTEXT")
    private String img;
}
