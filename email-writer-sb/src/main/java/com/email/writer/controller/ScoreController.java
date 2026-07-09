package com.email.writer.controller;

import com.email.writer.dto.ScoreRequestDto;
import com.email.writer.dto.ScoreResponseDto;
import com.email.writer.service.AtsScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin("*")
public class ScoreController {
    
    private final AtsScoringService atsScoringService;

    public ScoreController(AtsScoringService atsScoringService) {
        this.atsScoringService = atsScoringService;
    }

    @PostMapping("/score")
    public ResponseEntity<ScoreResponseDto> scoreResume(@RequestBody ScoreRequestDto request) {
        if (request.getResume() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(atsScoringService.scoreResume(request.getResume()));
    }
}
