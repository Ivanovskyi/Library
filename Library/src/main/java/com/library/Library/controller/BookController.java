package com.library.Library.controller;

import com.library.Library.entity.Book;
import com.library.Library.responsemodels.BooksResponse;
import com.library.Library.responsemodels.ShelfCurrentLoansResponse;
import com.library.Library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.*;

import java.util.List;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {

    private final BookService bookService;

    @GetMapping
    public BooksResponse findAllBooks(@Min(value = 0, message = "Page must be non-negative") @RequestParam(defaultValue = "0") int page,
                                      @Min(value = 1, message = "Size must be at least 1") @Max(value = 100, message = "Size must not exceed 100") @RequestParam(defaultValue = "9") int size) {
        return new BooksResponse(bookService.findAllBooks(page, size));
    }

    @GetMapping("/{bookId}/image")
    public String getBookImage(@Min(value = 1, message = "Book ID must be positive") @PathVariable Long bookId) {
        return bookService.getBookImage(bookId);
    }

    @GetMapping("/secure/currentloans")
    public ResponseEntity<List<ShelfCurrentLoansResponse>> currentLoans(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ShelfCurrentLoansResponse> loans = bookService.currentLoans(userEmail);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(Authentication authentication) {
        String userEmail = authentication.getName();
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping({"/secure/ischeckedout/byuser", "/secure/ischeckedout/byuser/"})
    public Boolean checkoutBookByUser(Authentication authentication,
                                      @Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping({"/secure/checkout", "/secure/checkout/"})
    public ResponseEntity<Book> checkoutBook(Authentication authentication,
                             @Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        Book book = bookService.checkoutBook(userEmail, bookId);
        return ResponseEntity.ok(book);
    }

    @PutMapping("/secure/return")
    public ResponseEntity<Void> returnBook(Authentication authentication,
                           @Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        bookService.returnBook(userEmail, bookId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/secure/renew/loan")
    public ResponseEntity<Void> renewLoan(Authentication authentication,
                          @Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        bookService.renewLoan(userEmail, bookId);
        return ResponseEntity.ok().build();
    }
}