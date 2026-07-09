package com.email.writer.controller;

import com.email.writer.dto.ResumeDto;
import com.email.writer.dto.ScoreRequestDto;
import com.email.writer.dto.ScoreResponseDto;
import com.email.writer.service.AtsScoringService;
import com.email.writer.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin("*")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    public ResponseEntity<List<ResumeDto>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDto> getResumeById(@PathVariable String id) {
        ResumeDto resume = resumeService.getResumeById(id);
        if (resume != null) {
            return ResponseEntity.ok(resume);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ResumeDto> createResume(@RequestBody ResumeDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeService.createResume(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResumeDto> updateResume(@PathVariable String id, @RequestBody ResumeDto dto) {
        ResumeDto updated = resumeService.updateResume(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable String id) {
        boolean deleted = resumeService.deleteResume(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
