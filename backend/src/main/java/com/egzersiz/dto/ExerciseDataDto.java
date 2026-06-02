package com.egzersiz.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExerciseDataDto {
    private String exerciseId;
    private String name;
    private String gifUrl;
    
    @JsonProperty("primaryMuscles")
    private List<String> targetMuscles;
    
    private List<String> bodyParts;
    
    @JsonProperty("equipment")
    private String equipment; // Source has single string equipment
    
    private List<String> equipments; // Target expects list
    
    @JsonProperty("secondaryMuscles")
    private List<String> secondaryMuscles;
    
    private List<String> instructions;
    private List<String> images;
    private String category;
    private String level;
}
