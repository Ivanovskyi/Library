package com.library.spring_boot_library.repository;

import com.library.spring_boot_library.entity.Checkout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);
    Page<Checkout> findByUserEmail(String userEmail, Pageable pageable);
}
