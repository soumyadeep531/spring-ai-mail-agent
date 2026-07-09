package com.email.writer.service;

import com.email.writer.dto.ResumeDto;
import com.email.writer.entity.*;
import com.email.writer.repository.ResumeRepository;
import com.email.writer.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        }
        throw new RuntimeException("User not found");
    }

    public List<ResumeDto> getAllResumes() {
        User user = getAuthenticatedUser();
        return resumeRepository.findAll().stream()
                .filter(r -> r.getUser() != null && r.getUser().getId().equals(user.getId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ResumeDto getResumeById(String id) {
        Optional<Resume> resume = resumeRepository.findById(UUID.fromString(id));
        return resume.map(this::mapToDto).orElse(null);
    }

    public ResumeDto createResume(ResumeDto dto) {
        Resume resume = new Resume();
        resume.setUser(getAuthenticatedUser());
        resume.setCreatedAt(LocalDateTime.now());
        mapToEntity(dto, resume);
        Resume saved = resumeRepository.save(resume);
        return mapToDto(saved);
    }

    public ResumeDto updateResume(String id, ResumeDto dto) {
        Optional<Resume> optionalResume = resumeRepository.findById(UUID.fromString(id));
        if (optionalResume.isPresent()) {
            Resume resume = optionalResume.get();
            mapToEntity(dto, resume);
            resume.setUpdatedAt(LocalDateTime.now());
            Resume saved = resumeRepository.save(resume);
            return mapToDto(saved);
        }
        return null;
    }

    public boolean deleteResume(String id) {
        Optional<Resume> optionalResume = resumeRepository.findById(UUID.fromString(id));
        if (optionalResume.isPresent()) {
            resumeRepository.delete(optionalResume.get());
            return true;
        }
        return false;
    }

    private void mapToEntity(ResumeDto dto, Resume resume) {
        if (dto.getTitle() != null) resume.setTitle(dto.getTitle());
        if (dto.getTemplateId() != null) resume.setTemplateId(dto.getTemplateId());
        if (dto.getAccentColor() != null) resume.setAccentColor(dto.getAccentColor());
        if (dto.getScore() != null) resume.setAtsScore(dto.getScore());
        
        // Ensure lists are initialized
        if (resume.getExperiences() == null) resume.setExperiences(new ArrayList<>());
        if (resume.getEducations() == null) resume.setEducations(new ArrayList<>());
        if (resume.getSkills() == null) resume.setSkills(new ArrayList<>());
        if (resume.getLanguages() == null) resume.setLanguages(new ArrayList<>());
        if (resume.getCertifications() == null) resume.setCertifications(new ArrayList<>());
        if (resume.getAwards() == null) resume.setAwards(new ArrayList<>());
        
        if (dto.getPersonalInfo() != null) {
            if (resume.getContact() == null) {
                Contact contact = new Contact();
                contact.setResume(resume);
                resume.setContact(contact);
            }
            resume.getContact().setFullName(dto.getPersonalInfo().getFullName());
            resume.getContact().setJobTitle(dto.getPersonalInfo().getJobTitle());
            resume.getContact().setEmail(dto.getPersonalInfo().getEmail());
            resume.getContact().setPhone(dto.getPersonalInfo().getPhone());
            resume.getContact().setLocation(dto.getPersonalInfo().getLocation());
        }

        if (dto.getSummary() != null) {
            if (resume.getSummary() == null) {
                Summary summary = new Summary();
                summary.setResume(resume);
                resume.setSummary(summary);
            }
            resume.getSummary().setContent(dto.getSummary());
        }

        if (dto.getExperience() != null) {
            resume.getExperiences().clear();
            for (int i = 0; i < dto.getExperience().size(); i++) {
                ResumeDto.ExperienceDto expDto = dto.getExperience().get(i);
                Experience exp = new Experience();
                exp.setResume(resume);
                exp.setCompany(expDto.getCompany());
                exp.setRole(expDto.getRole());
                exp.setStartDate(expDto.getStartDate());
                exp.setEndDate(expDto.getEndDate());
                exp.setCurrent(expDto.getCurrent());
                exp.setOrderIndex(i);
                if (expDto.getBullets() != null) {
                    exp.setBullets(new ArrayList<>(expDto.getBullets()));
                }
                resume.getExperiences().add(exp);
            }
        }

        if (dto.getEducation() != null) {
            resume.getEducations().clear();
            for (int i = 0; i < dto.getEducation().size(); i++) {
                ResumeDto.EducationDto eduDto = dto.getEducation().get(i);
                Education edu = new Education();
                edu.setResume(resume);
                edu.setInstitution(eduDto.getInstitution());
                edu.setDegree(eduDto.getDegree());
                edu.setStartDate(eduDto.getStartDate());
                edu.setEndDate(eduDto.getEndDate());
                edu.setScore(eduDto.getScore());
                edu.setOrderIndex(i);
                resume.getEducations().add(edu);
            }
        }

        if (dto.getSkills() != null) {
            resume.getSkills().clear();
            for (String skillName : dto.getSkills()) {
                Skill skill = new Skill();
                skill.setResume(resume);
                skill.setName(skillName);
                resume.getSkills().add(skill);
            }
        }

        if (dto.getLanguages() != null) {
            resume.getLanguages().clear();
            for (int i = 0; i < dto.getLanguages().size(); i++) {
                ResumeDto.LanguageDto langDto = dto.getLanguages().get(i);
                Language lang = new Language();
                lang.setResume(resume);
                lang.setName(langDto.getName());
                lang.setProficiency(langDto.getProficiency());
                lang.setOrderIndex(i);
                resume.getLanguages().add(lang);
            }
        }

        if (dto.getCertifications() != null) {
            resume.getCertifications().clear();
            for (int i = 0; i < dto.getCertifications().size(); i++) {
                ResumeDto.CertificationDto certDto = dto.getCertifications().get(i);
                Certification cert = new Certification();
                cert.setResume(resume);
                cert.setName(certDto.getName());
                cert.setIssuer(certDto.getIssuer());
                cert.setDate(certDto.getDate());
                cert.setOrderIndex(i);
                resume.getCertifications().add(cert);
            }
        }

        if (dto.getAwards() != null) {
            resume.getAwards().clear();
            for (int i = 0; i < dto.getAwards().size(); i++) {
                ResumeDto.AwardDto awardDto = dto.getAwards().get(i);
                Award award = new Award();
                award.setResume(resume);
                award.setTitle(awardDto.getTitle());
                award.setIssuer(awardDto.getIssuer());
                award.setDate(awardDto.getDate());
                award.setOrderIndex(i);
                resume.getAwards().add(award);
            }
        }
    }

    private ResumeDto mapToDto(Resume resume) {
        ResumeDto dto = new ResumeDto();
        dto.setId(resume.getId() != null ? resume.getId().toString() : null);
        dto.setTitle(resume.getTitle());
        dto.setTemplateId(resume.getTemplateId());
        dto.setAccentColor(resume.getAccentColor());
        dto.setScore(resume.getAtsScore());
        dto.setCreatedAt(resume.getCreatedAt() != null ? resume.getCreatedAt().toString() : null);
        dto.setUpdatedAt(resume.getUpdatedAt() != null ? resume.getUpdatedAt().toString() : null);

        if (resume.getContact() != null) {
            ResumeDto.PersonalInfoDto pInfo = new ResumeDto.PersonalInfoDto();
            pInfo.setFullName(resume.getContact().getFullName());
            pInfo.setJobTitle(resume.getContact().getJobTitle());
            pInfo.setEmail(resume.getContact().getEmail());
            pInfo.setPhone(resume.getContact().getPhone());
            pInfo.setLocation(resume.getContact().getLocation());
            dto.setPersonalInfo(pInfo);
        }

        if (resume.getSummary() != null) {
            dto.setSummary(resume.getSummary().getContent());
        }

        if (resume.getExperiences() != null) {
            List<ResumeDto.ExperienceDto> expDtos = resume.getExperiences().stream().map(exp -> {
                ResumeDto.ExperienceDto eDto = new ResumeDto.ExperienceDto();
                eDto.setId(exp.getId() != null ? exp.getId().toString() : null);
                eDto.setCompany(exp.getCompany());
                eDto.setRole(exp.getRole());
                eDto.setStartDate(exp.getStartDate());
                eDto.setEndDate(exp.getEndDate());
                eDto.setCurrent(exp.getCurrent());
                eDto.setBullets(exp.getBullets());
                return eDto;
            }).collect(Collectors.toList());
            dto.setExperience(expDtos);
        }

        if (resume.getEducations() != null) {
            List<ResumeDto.EducationDto> eduDtos = resume.getEducations().stream().map(edu -> {
                ResumeDto.EducationDto eDto = new ResumeDto.EducationDto();
                eDto.setId(edu.getId() != null ? edu.getId().toString() : null);
                eDto.setInstitution(edu.getInstitution());
                eDto.setDegree(edu.getDegree());
                eDto.setStartDate(edu.getStartDate());
                eDto.setEndDate(edu.getEndDate());
                eDto.setScore(edu.getScore());
                return eDto;
            }).collect(Collectors.toList());
            dto.setEducation(eduDtos);
        }

        if (resume.getSkills() != null) {
            List<String> skills = resume.getSkills().stream().map(Skill::getName).collect(Collectors.toList());
            dto.setSkills(skills);
        }

        if (resume.getLanguages() != null) {
            List<ResumeDto.LanguageDto> langDtos = resume.getLanguages().stream().map(lang -> {
                ResumeDto.LanguageDto lDto = new ResumeDto.LanguageDto();
                lDto.setId(lang.getId() != null ? lang.getId().toString() : null);
                lDto.setName(lang.getName());
                lDto.setProficiency(lang.getProficiency());
                return lDto;
            }).collect(Collectors.toList());
            dto.setLanguages(langDtos);
        }

        if (resume.getCertifications() != null) {
            List<ResumeDto.CertificationDto> certDtos = resume.getCertifications().stream().map(cert -> {
                ResumeDto.CertificationDto cDto = new ResumeDto.CertificationDto();
                cDto.setId(cert.getId() != null ? cert.getId().toString() : null);
                cDto.setName(cert.getName());
                cDto.setIssuer(cert.getIssuer());
                cDto.setDate(cert.getDate());
                return cDto;
            }).collect(Collectors.toList());
            dto.setCertifications(certDtos);
        }

        if (resume.getAwards() != null) {
            List<ResumeDto.AwardDto> awardDtos = resume.getAwards().stream().map(award -> {
                ResumeDto.AwardDto aDto = new ResumeDto.AwardDto();
                aDto.setId(award.getId() != null ? award.getId().toString() : null);
                aDto.setTitle(award.getTitle());
                aDto.setIssuer(award.getIssuer());
                aDto.setDate(award.getDate());
                return aDto;
            }).collect(Collectors.toList());
            dto.setAwards(awardDtos);
        }

        return dto;
    }
}
