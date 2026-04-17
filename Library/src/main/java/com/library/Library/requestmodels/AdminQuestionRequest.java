package com.library.Library.requestmodels;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class AdminQuestionRequest {

    @Min(value = 1, message = "Message ID must be positive")
    private Long id;

    @NotBlank(message = "Response is required")
    @Size(max = 1000, message = "Response must be less than 1000 characters")
    private String response;
}
