package com.library.Library.dto;

public record BookDTO(
    Long id,
    String title,
    String author,
    String description,
    int copies,
    int copiesAvailable,
    String category
) {
}
