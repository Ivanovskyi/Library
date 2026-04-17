package com.library.Library.responsemodels;

import com.library.Library.dto.BookDTO;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class BooksResponse {
    
    private List<BookDTO> books;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    
    public BooksResponse(Page<BookDTO> bookPage) {
        this.books = bookPage.getContent();
        this.currentPage = bookPage.getNumber();
        this.totalPages = bookPage.getTotalPages();
        this.totalItems = bookPage.getTotalElements();
    }
}
