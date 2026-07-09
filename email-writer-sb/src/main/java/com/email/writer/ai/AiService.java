package com.email.writer.ai;

import com.email.writer.dto.AiRequestDto;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@Service
public class AiService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public AiService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
        this.objectMapper = new ObjectMapper();
    }

    public Mono<Map<String, String>> generateSummary(AiRequestDto request) {
        String skills = (request.getKeySkills() != null && !request.getKeySkills().isEmpty()) 
                        ? String.join(", ", request.getKeySkills()) 
                        : "industry standard skills";
        String prompt = String.format("Generate a professional, compelling resume summary (about 3-4 sentences, written in the active, third-person voice) for a resume. \n" +
                "Job Title: %s\n" +
                "Experience Level: %s\n" +
                "Key Skills: %s\n\n" +
                "Keep it concise, industry-aligned, and impact-focused. Avoid clichés like 'passionate self-starter'. Return only the summary text without markdown formatting, headers, or surrounding quotes.",
                request.getJobTitle(), request.getExperienceLevel(), skills);

        return geminiClient.generate(prompt)
                .map(text -> Map.of("summary", text.trim()));
    }

    public Mono<Map<String, String>> generateBulletPoint(AiRequestDto request) {
        String prompt = String.format("Improve the following resume bullet point to make it more action-oriented, metrics-driven, and highly professional.\n" +
                "Core accomplishment: \"%s\"\n" +
                "Role Context: \"%s\"\n\n" +
                "Integrate strong action verbs (e.g., Spearheaded, Synthesized, Orchestrated, Engineered, Pioneered) and suggest a placeholder metric (e.g., 'by 25%%' or 'saving $15K annually') to make it quantifiable. Return only the improved bullet point as a single string, with no quotes or introductory text.",
                request.getRoughText(), request.getRoleContext() != null ? request.getRoleContext() : "Professional");

        return geminiClient.generate(prompt)
                .map(text -> Map.of("bullet", text.trim()));
    }

    public Mono<Map<String, String>> generateEmailReply(AiRequestDto request) {
        String prompt = String.format("Craft a %s email reply to the following email:\n\n%s\n\nReturn only the email reply without any surrounding text or quotes.",
                request.getTone() != null ? request.getTone() : "professional",
                request.getOriginalEmail());

        return geminiClient.generate(prompt)
                .map(text -> Map.of("reply", text.trim()));
    }

    public Mono<Map<String, List<String>>> suggestSkills(AiRequestDto request) {
        String prompt = String.format("Provide a list of 8 to 10 highly relevant, standard industry skills for a \"%s\" role. Return the list as a JSON array of strings. Do not include markdown codeblocks (such as ```json), just the plain raw JSON array text.",
                request.getJobTitle());

        return geminiClient.generate(prompt)
                .map(text -> {
                    try {
                        String cleanText = text.trim();
                        if(cleanText.startsWith("```json")) {
                            cleanText = cleanText.substring(7);
                            if(cleanText.endsWith("```")) {
                                cleanText = cleanText.substring(0, cleanText.length() - 3);
                            }
                        }
                        List<String> skills = Arrays.asList(objectMapper.readValue(cleanText.trim(), String[].class));
                        return Map.of("skills", skills);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return Map.of("skills", List.of("Communication", "Teamwork", "Problem Solving", "Leadership"));
                    }
                });
    }
}
