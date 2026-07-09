package com.email.writer.controller;

import com.email.writer.dto.ResumeDto;
import com.email.writer.service.PdfRenderService;
import com.email.writer.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
public class PdfController {

    private final ResumeService resumeService;
    private final PdfRenderService pdfRenderService;

    public PdfController(ResumeService resumeService, PdfRenderService pdfRenderService) {
        this.resumeService = resumeService;
        this.pdfRenderService = pdfRenderService;
    }

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportToPdf(@PathVariable String id) {
        ResumeDto resumeDto = resumeService.getResumeById(id);
        if (resumeDto == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] pdfBytes = pdfRenderService.generatePdfFromResume(resumeDto);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = (resumeDto.getPersonalInfo() != null && resumeDto.getPersonalInfo().getFullName() != null) 
                    ? resumeDto.getPersonalInfo().getFullName().replaceAll("\\s+", "_") + "_Resume.pdf"
                    : "Resume.pdf";
            headers.setContentDispositionFormData("attachment", filename);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
