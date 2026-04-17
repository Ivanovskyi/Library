package com.library.Library.service;

import com.library.Library.dao.BookRepository;
import com.library.Library.dao.CheckoutRepository;
import com.library.Library.dao.ReviewRepository;
import com.library.Library.entity.Book;
import com.library.Library.exception.BookNotFoundException;
import com.library.Library.exception.BookQuantityException;
import com.library.Library.requestmodels.AddBookRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;

    public void increaseBookQuantity(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));

        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        book.setCopies(book.getCopies() + 1);

        bookRepository.save(book);
    }

    public void decreaseBookQuantity(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));

        if (book.getCopiesAvailable() <= 0 || book.getCopies() <= 0) {
            throw new BookQuantityException("Book quantity locked");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        book.setCopies(book.getCopies() - 1);

        bookRepository.save(book);
    }

    public void postBook(AddBookRequest addBookRequest) {

        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());

        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));

        bookRepository.delete(book);

        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }
}