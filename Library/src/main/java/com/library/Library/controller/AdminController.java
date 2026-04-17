package com.library.Library.controller;

import com.library.Library.requestmodels.AddBookRequest;
import com.library.Library.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final AdminService adminService;

    @PutMapping({"/secure/increase/book/quantity", "/secure/increase/book/quantity/"})
    public ResponseEntity<Void> increaseBookQuantity(@Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        adminService.increaseBookQuantity(bookId);
        return ResponseEntity.ok().build();
    }

    @PutMapping({"/secure/decrease/book/quantity", "/secure/decrease/book/quantity/"})
    public ResponseEntity<Void> decreaseBookQuantity(@Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        adminService.decreaseBookQuantity(bookId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/secure/add/book")
    public ResponseEntity<Void> postBook(@Valid @RequestBody AddBookRequest addBookRequest) {
        adminService.postBook(addBookRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping({"/secure/delete/book", "/secure/delete/book/"})
    public ResponseEntity<Void> deleteBook(@Min(value = 1, message = "Book ID must be positive") @RequestParam Long bookId) {
        adminService.deleteBook(bookId);
        return ResponseEntity.ok().build();
    }
}












