package service;

import dto.ExerciseDataDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExerciseService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Getter
    private List<ExerciseDataDto> exercisesCache = new ArrayList<>();

    @PostConstruct
    public void init() {
        try {
            File exercisesRoot = Paths.get("exercises-data", "exercises").toFile();
            if (exercisesRoot.exists() && exercisesRoot.isDirectory()) {
                File[] folders = exercisesRoot.listFiles(File::isDirectory);
                if (folders != null) {
                    for (File folder : folders) {
                        File jsonFile = new File(folder, "exercise.json");
                        if (jsonFile.exists()) {
                            ExerciseDataDto ex = objectMapper.readValue(jsonFile, ExerciseDataDto.class);
                            
                            ex.setExerciseId(folder.getName());
                            
                            // Map equipment to equipments (list)
                            if (ex.getEquipments() == null || ex.getEquipments().isEmpty()) {
                                if (ex.getEquipment() != null) {
                                    List<String> eqs = new ArrayList<>();
                                    eqs.add(ex.getEquipment());
                                    ex.setEquipments(eqs);
                                }
                            }

                            // Add image paths
                            File imagesDir = new File(folder, "images");
                            List<String> imagePaths = new ArrayList<>();
                            if (imagesDir.exists() && imagesDir.isDirectory()) {
                                File[] images = imagesDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jpg") || name.toLowerCase().endsWith(".png"));
                                if (images != null) {
                                    Arrays.sort(images);
                                    for (File img : images) {
                                        imagePaths.add(folder.getName() + "/images/" + img.getName());
                                    }
                                }
                            }
                            ex.setImages(imagePaths);
                            if (!imagePaths.isEmpty()) {
                                ex.setGifUrl(imagePaths.get(0));
                            }

                            exercisesCache.add(ex);
                        }
                    }
                }
                log.info("Loaded {} exercises from exercises-data directory", exercisesCache.size());
            } else {
                log.error("Could not find exercises directory at {}", exercisesRoot.getAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to load exercise data from exercises-data", e);
        }
    }

    @org.springframework.cache.annotation.Cacheable("exercises")
    public List<ExerciseDataDto> getExercisesByMuscle(String muscleName) {
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
            List<String> targetMuscles = ex.getTargetMuscles() != null ? ex.getTargetMuscles() : new ArrayList<>();
            List<String> secondaryMuscles = ex.getSecondaryMuscles() != null ? ex.getSecondaryMuscles() : new ArrayList<>();
            
            boolean matchesPrimary = targetMuscles.stream()
                .anyMatch(tm -> mappedMuscles.contains(tm.toLowerCase()));
            boolean matchesSecondary = secondaryMuscles.stream()
                .anyMatch(sm -> mappedMuscles.contains(sm.toLowerCase()));
            
            return matchesPrimary || matchesSecondary;
        }).collect(Collectors.toList());
    }

    @org.springframework.cache.annotation.Cacheable("exercises")
    public List<ExerciseDataDto> getWarmupExercises() {
        return exercisesCache.stream().filter(ex -> {
            String cat = ex.getCategory() != null ? ex.getCategory().toLowerCase() : "";
            String name = ex.getName() != null ? ex.getName().toLowerCase() : "";
            String level = ex.getLevel() != null ? ex.getLevel().toLowerCase() : "";
            String equip = ex.getEquipment() != null ? ex.getEquipment().toLowerCase() : "";

            // User specifically asked to remove bicycle and focus on home-friendly warmups
            if (name.contains("bicycle") || name.contains("bike") || equip.contains("machine")) return false;

            // Warmup criteria: Stretching or light bodyweight movements
            boolean isStretching = cat.contains("stretching") || cat.contains("stretches");
            boolean isWarmupKeywords = name.contains("circle") || name.contains("stretch") || name.contains("rotation") 
                                    || name.contains("warm up") || name.contains("warmup") || name.contains("dynamic");
            
            // Basic bodyweight home movements (No equipment needed)
            boolean isHomeFriendly = (equip.contains("body only") || equip.equals("")) 
                                    && (name.contains("jack") || name.contains("run") || name.contains("walk") 
                                        || name.contains("squat") || name.contains("plank") || name.contains("knee"));

            return isStretching || isWarmupKeywords || isHomeFriendly;
        }).collect(Collectors.toList());
    }
}
