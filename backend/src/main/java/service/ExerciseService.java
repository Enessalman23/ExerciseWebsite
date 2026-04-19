package service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExerciseService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private List<Map<String, Object>> exercisesCache = new ArrayList<>();

    @PostConstruct
    public void init() {
        try {
            File jsonFile = Paths.get("exercisedb_v1_sample", "exercises.json").toFile();
            if (jsonFile.exists()) {
                exercisesCache = objectMapper.readValue(jsonFile, new TypeReference<List<Map<String, Object>>>() {});
                log.info("Loaded {} exercises for lookup", exercisesCache.size());
            } else {
                log.error("Could not find exercises.json at {}", jsonFile.getAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to load local exercise data", e);
        }
    }

    public List<Map<String, Object>> getExercisesByMuscle(String muscleName) {
        if (muscleName == null || muscleName.isEmpty()) return new ArrayList<>();
        String query = muscleName.toLowerCase().trim();

        // Mapping react-body-highlighter slugs to our dataset
        List<String> mappedMuscles = new ArrayList<>();
        mappedMuscles.add(query);
        
        switch (query) {
            case "chest":
                mappedMuscles.add("pectorals");
                mappedMuscles.add("upper chest");
                mappedMuscles.add("lower chest");
                break;
            case "upper-back":
                mappedMuscles.add("upper back");
                mappedMuscles.add("lats");
                mappedMuscles.add("trapezius");
                mappedMuscles.add("traps");
                mappedMuscles.add("rhomboids");
                mappedMuscles.add("back");
                break;
            case "lower-back":
                mappedMuscles.add("lower back");
                mappedMuscles.add("spine");
                break;
            case "shoulders":
                mappedMuscles.add("delts");
                mappedMuscles.add("deltoids");
                mappedMuscles.add("rear deltoids");
                break;
            case "biceps":
                mappedMuscles.add("brachialis");
                break;
            case "triceps":
                mappedMuscles.add("triceps");
                break;
            case "glutes":
            case "gluteal":
                mappedMuscles.add("glutes");
                mappedMuscles.add("gluteus maximus");
                break;
            case "forearm":
                mappedMuscles.add("forearms");
                mappedMuscles.add("wrists");
                mappedMuscles.add("wrist flexors");
                mappedMuscles.add("wrist extensors");
                mappedMuscles.add("lower arms");
                break;
            case "abs":
            case "obliques":
                mappedMuscles.add("abdominals");
                mappedMuscles.add("lower abs");
                mappedMuscles.add("core");
                mappedMuscles.add("obliques");
                break;
            case "quadriceps":
                mappedMuscles.add("quads");
                mappedMuscles.add("upper legs");
                break;
            case "hamstring":
                mappedMuscles.add("hamstrings");
                break;
            case "calves":
                mappedMuscles.add("lower legs");
                mappedMuscles.add("calves");
                break;
            case "trapezius":
            case "neck":
                mappedMuscles.add("traps");
                mappedMuscles.add("neck");
                break;
        }

        return exercisesCache.stream().filter(ex -> {
            // Handle both singular (old) and plural (new API) fields
            Object target = ex.get("targetMuscles");
            if (target == null) target = ex.get("target"); // fallback for old data
            
            List<String> targetMuscles = new ArrayList<>();
            if (target instanceof List) {
                targetMuscles = (List<String>) target;
            } else if (target instanceof String) {
                targetMuscles.add((String) target);
            }

            Object secondary = ex.get("secondaryMuscles");
            List<String> secondaryMuscles = (secondary instanceof List) ? (List<String>) secondary : new ArrayList<>();
            
            boolean matchesPrimary = targetMuscles.stream()
                .anyMatch(tm -> mappedMuscles.contains(tm.toLowerCase()));
            boolean matchesSecondary = secondaryMuscles.stream()
                .anyMatch(sm -> mappedMuscles.contains(sm.toLowerCase()));
            
            return matchesPrimary || matchesSecondary;
        }).collect(Collectors.toList());
    }
}
