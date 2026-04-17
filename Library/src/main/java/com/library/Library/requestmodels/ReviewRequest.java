package com.library.Library.requestmodels;

import lombok.Data;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.util.Optional;

@Data
public class ReviewRequest {

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5.0")
    private double rating;

    @NotNull(message = "Book ID is required")
    @Min(value = 1, message = "Book ID must be positive")
    private Long bookId;

    private Optional<String> reviewDescription;
}
