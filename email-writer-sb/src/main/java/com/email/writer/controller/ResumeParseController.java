package com.email.writer.controller;

import com.email.writer.ai.GeminiClient;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@RestController
@RequestMapping("/api/resume")
public class ResumeParseController {

    private final GeminiClient geminiClient;

    public ResumeParseController(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    @PostMapping("/parse")
    public ResponseEntity<String> parseResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Please upload a valid file\"}");
        }

        String fileName = file.getOriginalFilename().toLowerCase();
        if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
            return ResponseEntity.badRequest().body("{\"error\": \"Only PDF and DOCX files are supported\"}");
        }

        try (InputStream is = file.getInputStream()) {
            String text = "";
            
            if (fileName.endsWith(".pdf")) {
                try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes())) {
                    PDFTextStripper pdfStripper = new PDFTextStripper();
                    text = pdfStripper.getText(document);
                }
            } else if (fileName.endsWith(".docx")) {
                try (XWPFDocument docx = new XWPFDocument(is);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(docx)) {
                    text = extractor.getText();
                }
            }

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.ok("{\"resumeId\": \"" + UUID.randomUUID().toString() + "\", \"confidence\": \"low\", \"unmappedText\": [\"Could not extract text from the document\"], \"parsedData\": {}}");
            }

            String prompt = "You are a professional resume parser. Parse the following resume text into a strict JSON format that matches this exact schema wrapper:\n" +
                    "{\n" +
                    "  \"resumeId\": \"will-be-set-by-backend\",\n" +
                    "  \"confidence\": \"high|medium|low\",\n" +
                    "  \"unmappedText\": [\"Any important text blocks that couldn't be cleanly mapped to the sections below\"],\n" +
                    "  \"parsedData\": {\n" +
                    "    \"personalInfo\": { \"fullName\": \"\", \"jobTitle\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"website\": \"\" },\n" +
                    "    \"summary\": \"\",\n" +
                    "    \"experience\": [ { \"company\": \"\", \"role\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"current\": false, \"bullets\": [\"\", \"\"] } ],\n" +
                    "    \"education\": [ { \"institution\": \"\", \"degree\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"score\": \"\" } ],\n" +
                    "    \"skills\": [\"\"],\n" +
                    "    \"languages\": [ { \"name\": \"\", \"proficiency\": \"\" } ],\n" +
                    "    \"certifications\": [ { \"name\": \"\", \"issuer\": \"\", \"date\": \"\" } ],\n" +
                    "    \"awards\": [ { \"title\": \"\", \"issuer\": \"\", \"date\": \"\" } ]\n" +
                    "  }\n" +
                    "}\n\n" +
                    "Use 'high' confidence if most sections are populated, 'low' if it's struggling. Do not include markdown or backticks, just the raw JSON.\n\n" +
                    "Resume Text:\n" + text;

            String jsonResponse = geminiClient.generate(prompt).block();
            if (jsonResponse != null) {
                jsonResponse = jsonResponse.replace("```json", "").replace("```", "").trim();
                // Inject a UUID so the frontend has a mock ID to navigate to if we don't save it to the DB instantly.
                // In a real flow we'd save it to the DB as DRAFT and return the real DB ID. 
                // We'll just generate one here so the frontend can route to /builder/:id?draft=true
                jsonResponse = jsonResponse.replace("\"will-be-set-by-backend\"", UUID.randomUUID().toString());
            }

            return ResponseEntity.ok(jsonResponse);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to parse resume\"}");
        }
    }
}
