package com.email.writer.dto;

import lombok.Data;
import java.util.List;

@Data
public class ScoreResponseDto {
    private Integer score;
    private SubScores subScores;
    private List<Suggestion> suggestions;

    @Data
    public static class SubScores {
        private Integer completeness;
        private Integer formatting;
        private Integer keywords;
    }

    @Data
    public static class Suggestion {
        private String title;
        private String description;
        private String category;
    }
}
