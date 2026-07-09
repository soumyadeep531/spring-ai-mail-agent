package com.email.writer.ai;

import com.email.writer.dto.AiRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/summary")
    public Mono<ResponseEntity<Map<String, String>>> generateSummary(@RequestBody AiRequestDto request) {
        return aiService.generateSummary(request)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/bullet-point")
    public Mono<ResponseEntity<Map<String, String>>> generateBulletPoint(@RequestBody AiRequestDto request) {
        return aiService.generateBulletPoint(request)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/skill-suggestions")
    public Mono<ResponseEntity<Map<String, List<String>>>> suggestSkills(@RequestBody AiRequestDto request) {
        return aiService.suggestSkills(request)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/email-reply")
    public Mono<ResponseEntity<Map<String, String>>> generateEmailReply(@RequestBody AiRequestDto request) {
        return aiService.generateEmailReply(request)
                .map(ResponseEntity::ok);
    }
}
