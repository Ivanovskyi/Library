package com.library.Library.controller;

import com.library.Library.requestmodels.ReviewRequest;
import com.library.Library.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping({"/secure/user/book", "/secure/user/book/"})
    public Boolean reviewBookByUser(Authentication authentication,
                                    @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        return reviewService.userReviewListed(userEmail, bookId);
    }

    @PostMapping("/secure")
    public void postReview(Authentication authentication,
                           @Valid @RequestBody ReviewRequest reviewRequest) {
        String userEmail = authentication.getName();
        reviewService.postReview(userEmail, reviewRequest);
    }
}