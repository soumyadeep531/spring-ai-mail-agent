package com.email.writer.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getTemplates() {
        return ResponseEntity.ok(Arrays.asList(
            Map.of(
                "id", "modern",
                "name", "Modern",
                "layoutType", "two-column",
                "previewSampleDataUrl", "/api/templates/modern/sample/pdf"
            ),
            Map.of(
                "id", "professional",
                "name", "Professional",
                "layoutType", "single-column",
                "previewSampleDataUrl", "/api/templates/professional/sample/pdf"
            ),
            Map.of(
                "id", "elegant",
                "name", "Elegant",
                "layoutType", "two-column-photo",
                "previewSampleDataUrl", "/api/templates/elegant/sample/pdf"
            ),
            Map.of(
                "id", "minimal",
                "name", "Minimal",
                "layoutType", "single-column",
                "previewSampleDataUrl", "/api/templates/minimal/sample/pdf"
            )
        ));
    }

    @GetMapping("/{id}/sample/pdf")
    public ResponseEntity<Resource> getSamplePdf(@PathVariable String id) {
        Resource pdfResource = new ClassPathResource("samples/mock-sample.pdf");
        
        if (!pdfResource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + id + "-sample.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfResource);
    }

    @GetMapping("/{id}/sample/docx")
    public ResponseEntity<Resource> getSampleDocx(@PathVariable String id) {
        Resource docxResource = new ClassPathResource("samples/mock-sample.docx");
        
        if (!docxResource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + id + "-sample.docx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(docxResource);
    }
}
