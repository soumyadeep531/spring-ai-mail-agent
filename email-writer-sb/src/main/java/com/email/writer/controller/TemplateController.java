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
                "id", "modern-sidebar",
                "name", "Modern",
                "layoutType", "two-column",
                "previewSampleDataUrl", "/api/templates/modern-sidebar/sample/pdf"
            ),
            Map.of(
                "id", "classic-centered",
                "name", "Classic",
                "layoutType", "single-column",
                "previewSampleDataUrl", "/api/templates/classic-centered/sample/pdf"
            ),
            Map.of(
                "id", "executive-photo",
                "name", "Executive",
                "layoutType", "two-column-photo",
                "previewSampleDataUrl", "/api/templates/executive-photo/sample/pdf"
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
