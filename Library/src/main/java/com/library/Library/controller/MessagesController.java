package com.library.Library.controller;

import com.library.Library.dao.MessageRepository;
import com.library.Library.entity.Message;
import com.library.Library.requestmodels.AdminQuestionRequest;
import com.library.Library.service.MessagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Validated
public class MessagesController {

    private final MessagesService messagesService;
    private final MessageRepository messageRepository;

    @PostMapping("/secure/add/message")
    public void postMessage(@Valid @RequestBody Message messageRequest,
                            Authentication authentication) {
        String userEmail = authentication.getName();
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@Valid @RequestBody AdminQuestionRequest adminQuestionRequest,
                           Authentication authentication) {
        String userEmail = authentication.getName();
        messagesService.putMessage(adminQuestionRequest, userEmail);
    }

    @GetMapping("/search/findByClosed")
    public ResponseEntity<Page<Message>> findByClosed(
            @RequestParam("closed") boolean closed,
            @Min(value = 0, message = "Page must be non-negative") @RequestParam(value = "page", defaultValue = "0") int page,
            @Min(value = 1, message = "Size must be at least 1") @Max(value = 100, message = "Size must not exceed 100") @RequestParam(value = "size", defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByClosed(closed, pageable);
        return ResponseEntity.ok(messages);
    }
}
