package com.library.Library.service;

import com.library.Library.dao.BookRepository;
import com.library.Library.dao.CheckoutRepository;
import com.library.Library.dao.HistoryRepository;
import com.library.Library.dao.PaymentRepository;
import com.library.Library.dto.BookDTO;
import com.library.Library.entity.Book;
import com.library.Library.entity.Checkout;
import com.library.Library.entity.History;
import com.library.Library.entity.Payment;
import com.library.Library.exception.CheckoutException;
import com.library.Library.exception.PaymentException;
import com.library.Library.responsemodels.ShelfCurrentLoansResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@Transactional
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    private HistoryRepository historyRepository;

    private PaymentRepository paymentRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
                       HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook (String userEmail, Long bookId) {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new CheckoutException("Book doesn't exist or already checked out by user");
        }

        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsReturned = false;

        for (Checkout checkout: currentBooksCheckedOut) {
            try {
                Date d1 = sdf.parse(checkout.getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                if (differenceInTime < 0) {
                    bookNeedsReturned = true;
                    break;
                }
            } catch (Exception e) {
                throw new PaymentException("Error parsing dates for checkout validation");
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
            throw new PaymentException("Outstanding fees");
        }

        if (userPayment == null) {
            Payment payment = new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for (Checkout i: checkoutList) {
            bookIdList.add(i.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {
                try {
                    Date d1 = sdf.parse(checkout.get().getReturnDate());
                    Date d2 = sdf.parse(LocalDate.now().toString());

                    TimeUnit time = TimeUnit.DAYS;

                    long difference_In_Time = time.convert(d1.getTime() - d2.getTime(),
                            TimeUnit.MILLISECONDS);

                    shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
                } catch (Exception e) {
                    throw new PaymentException("Error parsing dates for current loans");
                }
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook (String userEmail, Long bookId) {
        logger.info("Starting returnBook for user: {}, bookId: {}", userEmail, bookId);

        Optional<Book> book = bookRepository.findById(bookId);
        logger.info("Book found: {}", book.isPresent());

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        logger.info("Checkout found: {}", validateCheckout != null);

        if (!book.isPresent() || validateCheckout == null) {
            logger.error("Book does not exist or not checked out by user");
            throw new CheckoutException("Book does not exist or not checked out by user");
        }

        // Store checkout info before deleting
        String checkoutDate = validateCheckout.getCheckoutDate();
        String returnDate = validateCheckout.getReturnDate();
        Long checkoutId = validateCheckout.getId();
        logger.info("Stored checkout info - ID: {}, checkoutDate: {}, returnDate: {}", checkoutId, checkoutDate, returnDate);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1;
        Date d2;
        try {
            d1 = sdf.parse(returnDate);
            d2 = sdf.parse(LocalDate.now().toString());
        } catch (Exception e) {
            throw new PaymentException("Error parsing dates for return calculation");
        }

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if (differenceInTime < 0) {
            logger.info("Book is overdue by {} days", differenceInTime * -1);
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            logger.info("Payment found: {}", payment != null);
            
            if (payment == null) {
                logger.info("Creating new payment record for user: {}", userEmail);
                payment = new Payment();
                payment.setAmount(0.0);
                payment.setUserEmail(userEmail);
            }
            
            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment);
            logger.info("Payment updated successfully");
        }

        // Update book availability
        logger.info("Updating book availability, current copies: {}", book.get().getCopiesAvailable());
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        logger.info("Book availability updated successfully");

        // Delete checkout record safely
        if (checkoutId != null) {
            logger.info("Deleting checkout record with ID: {}", checkoutId);
            checkoutRepository.deleteById(checkoutId);
            logger.info("Checkout record deleted successfully");
        } else {
            logger.error("Checkout ID is null, cannot delete");
        }

        // Add to history
        logger.info("Adding to history");
        String description = book.get().getDescription();
        if (description != null && description.length() > 255) {
            description = description.substring(0, 255);
        }

        String img = null;
        History history = new History(
                userEmail,
                checkoutDate,
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                description,
                img
        );

        historyRepository.save(history);
        logger.info("History record saved successfully");
    }

    public void renewLoan(String userEmail, Long bookId) {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new CheckoutException("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1;
        Date d2;
        try {
            d1 = sdFormat.parse(validateCheckout.getReturnDate());
            d2 = sdFormat.parse(LocalDate.now().toString());
        } catch (Exception e) {
            throw new PaymentException("Error parsing dates for loan renewal");
        }

        // Allow renewal for all books (including overdue ones)
        validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
        checkoutRepository.save(validateCheckout);
    }

    public Page<BookDTO> findAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);
        
        // Convert Book entities to BookDTOs (excluding image data)
        List<BookDTO> bookDTOs = bookPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(bookDTOs, pageable, bookPage.getTotalElements());
    }
    
    private BookDTO convertToDTO(Book book) {
        return new BookDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getDescription(),
            book.getCopies(),
            book.getCopiesAvailable(),
            book.getCategory()
        );
    }

    public String getBookImage(Long bookId) {
        Optional<Book> book = bookRepository.findById(bookId);
        return book.map(Book::getImg).orElse(null);
    }

}















