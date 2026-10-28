package com.library.spring_boot_library.service;

import com.library.spring_boot_library.entity.Book;
import org.springframework.data.domain.Page;

public interface BookService {
    Page<Book> getAllBooks(int pageNo, int pageSize);

    Page<Book> findByTitleContaining(String title, int pageNo, int pageSize);

    Page<Book> findByCategory(String category, int pageNo, int pageSize);

    Book getBookById(Long id);
}
