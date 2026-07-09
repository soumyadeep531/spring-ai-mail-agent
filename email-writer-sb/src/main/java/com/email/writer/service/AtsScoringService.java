package com.email.writer.service;

import com.email.writer.dto.ResumeDto;
import com.email.writer.dto.ScoreResponseDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AtsScoringService {

    public ScoreResponseDto scoreResume(ResumeDto resume) {
        int completenessScore = 0;
        if (resume.getPersonalInfo() != null) {
            if (resume.getPersonalInfo().getFullName() != null && !resume.getPersonalInfo().getFullName().isEmpty()) completenessScore += 10;
            if (resume.getPersonalInfo().getEmail() != null && resume.getPersonalInfo().getPhone() != null) completenessScore += 10;
        }
        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) completenessScore += 15;
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) completenessScore += 30;
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) completenessScore += 15;
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) completenessScore += 10;
        if (resume.getLanguages() != null && !resume.getLanguages().isEmpty()) completenessScore += 5;
        if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) completenessScore += 5;

        int formattingScore = 80;
        List<ScoreResponseDto.Suggestion> formattingSuggestions = new ArrayList<>();
        if (resume.getExperience() != null) {
            boolean missingDates = resume.getExperience().stream().anyMatch(e -> e.getStartDate() == null || e.getStartDate().isEmpty());
            if (missingDates) {
                formattingScore -= 15;
                ScoreResponseDto.Suggestion suggestion = new ScoreResponseDto.Suggestion();
                suggestion.setTitle("Fill in missing work dates");
                suggestion.setDescription("Some of your experiences are missing start or end dates.");
                suggestion.setCategory("formatting");
                formattingSuggestions.add(suggestion);
            }
            boolean longBullets = resume.getExperience().stream()
                    .anyMatch(e -> e.getBullets() != null && e.getBullets().stream().anyMatch(b -> b.length() > 250));
            if (longBullets) {
                formattingScore -= 10;
                ScoreResponseDto.Suggestion suggestion = new ScoreResponseDto.Suggestion();
                suggestion.setTitle("Shorten excessively long bullet points");
                suggestion.setDescription("Keep bullets concise (under 200 characters).");
                suggestion.setCategory("formatting");
                formattingSuggestions.add(suggestion);
            }
        }

        int keywordsScore = 70;
        List<ScoreResponseDto.Suggestion> keywordSuggestions = new ArrayList<>();
        if (resume.getSkills() == null || resume.getSkills().size() < 5) {
            keywordsScore -= 15;
            ScoreResponseDto.Suggestion suggestion = new ScoreResponseDto.Suggestion();
            suggestion.setTitle("Add more core skills");
            suggestion.setDescription("We recommend adding at least 6 specialized skills.");
            suggestion.setCategory("keywords");
            keywordSuggestions.add(suggestion);
        } else {
            keywordsScore += 5;
        }

        int overallScore = Math.round((completenessScore + formattingScore + keywordsScore) / 3f);

        List<ScoreResponseDto.Suggestion> localSuggestions = new ArrayList<>();
        ScoreResponseDto.Suggestion defaultSuggestion = new ScoreResponseDto.Suggestion();
        defaultSuggestion.setTitle("Add metrics to bullet points");
        defaultSuggestion.setDescription("Quantify your achievements to prove your business value.");
        defaultSuggestion.setCategory("keywords");
        localSuggestions.add(defaultSuggestion);
        
        localSuggestions.addAll(formattingSuggestions);
        localSuggestions.addAll(keywordSuggestions);

        ScoreResponseDto response = new ScoreResponseDto();
        response.setScore(overallScore);
        
        ScoreResponseDto.SubScores subScores = new ScoreResponseDto.SubScores();
        subScores.setCompleteness(completenessScore);
        subScores.setFormatting(formattingScore);
        subScores.setKeywords(keywordsScore);
        response.setSubScores(subScores);
        
        response.setSuggestions(localSuggestions);
        return response;
    }
}
