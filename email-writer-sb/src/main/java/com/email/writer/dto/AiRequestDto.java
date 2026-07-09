package com.email.writer.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiRequestDto {
    private String jobTitle;
    private String experienceLevel;
    private List<String> keySkills;
    
    private String roughText;
    private String roleContext;
    
    private String text;
    private String tone;
    private String originalEmail;
}
