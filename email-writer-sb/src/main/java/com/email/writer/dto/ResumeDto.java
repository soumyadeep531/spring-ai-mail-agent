package com.email.writer.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ResumeDto {
    private String id;
    private String title;
    private String templateId;
    private String accentColor;
    private PersonalInfoDto personalInfo;
    private String summary;
    private List<ExperienceDto> experience;
    private List<EducationDto> education;
    private List<String> skills;
    private List<LanguageDto> languages;
    private List<CertificationDto> certifications;
    private List<AwardDto> awards;
    private Integer score;
    private String createdAt;
    private String updatedAt;

    @Data
    public static class PersonalInfoDto {
        private String fullName;
        private String jobTitle;
        private String email;
        private String phone;
        private String location;
        private String website;
    }

    @Data
    public static class ExperienceDto {
        private String id;
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private Boolean current;
        private List<String> bullets;
    }

    @Data
    public static class EducationDto {
        private String id;
        private String institution;
        private String degree;
        private String startDate;
        private String endDate;
        private String score;
    }

    @Data
    public static class LanguageDto {
        private String id;
        private String name;
        private String proficiency;
    }

    @Data
    public static class CertificationDto {
        private String id;
        private String name;
        private String issuer;
        private String date;
    }

    @Data
    public static class AwardDto {
        private String id;
        private String title;
        private String issuer;
        private String date;
    }
}
