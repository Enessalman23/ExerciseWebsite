package service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dto.ExerciseDataDto;
import dto.request.AiWorkoutRequest;
import dto.response.AiWorkoutResponse;
import entity.User;
import entity.WorkoutPlan;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import repository.WorkoutPlanRepository;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiGenerationService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WorkoutPlanRepository workoutPlanRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private List<ExerciseDataDto> exercises = new ArrayList<>();

    @PostConstruct
    public void init() {
        try {
            File jsonFile = new File("exercisedb_v1_sample/exercises.json");
            if (jsonFile.exists()) {
                exercises = objectMapper.readValue(jsonFile, new TypeReference<List<ExerciseDataDto>>() {});
                System.out.println("Loaded " + exercises.size() + " exercises from JSON.");
            } else {
                System.out.println("Could not find exercises.json at " + jsonFile.getAbsolutePath());
            }
        } catch (Exception e) {
            System.err.println("Failed to load exercises.json: " + e.getMessage());
        }
    }

    public AiWorkoutResponse generateWorkout(AiWorkoutRequest request, User user) {
        String prompt = buildPrompt(request);

        String geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        int maxRetries = 3;
        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < maxRetries) {
            try {
                HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
                String responseStr = restTemplate.postForObject(geminiEndpoint, httpEntity, String.class);
                JsonNode root = objectMapper.readTree(responseStr);
                String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                // Robust JSON extraction: Find the first '{' and the last '}'
                int firstBrace = aiText.indexOf('{');
                int lastBrace = aiText.lastIndexOf('}');

                if (firstBrace == -1 || lastBrace == -1 || lastBrace < firstBrace) {
                    System.err.println("CRITICAL: No valid JSON found in AI response: " + aiText);
                    throw new RuntimeException("AI response does not contain valid JSON.");
                }

                String cleanedJson = aiText.substring(firstBrace, lastBrace + 1);

                JsonNode generatedPlan = objectMapper.readTree(cleanedJson);
                enrichWithLocalData((ObjectNode) generatedPlan, request.getEquipments());

                WorkoutPlan plan = new WorkoutPlan();
                plan.setUser(user);
                plan.setGeneratedPlanJson(objectMapper.writeValueAsString(generatedPlan));
                plan.setPlanName(request.getPlanName());
                plan.setActive(true);
                plan = workoutPlanRepository.save(plan);

                return new AiWorkoutResponse(plan.getId(), plan.getGeneratedPlanJson(), "Workout created successfully!", plan.getPlanName());

            } catch (Exception e) {
                lastException = e;
                retryCount++;
                System.err.println("AI Workout attempt " + retryCount + " failed: " + e.getMessage());
                if (retryCount < maxRetries) {
                    try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
                }
            }
        }
        throw new RuntimeException("Failed to process AI workout plan after " + maxRetries + " attempts. Last error: " + lastException.getMessage(), lastException);
    }
    private String buildPrompt(AiWorkoutRequest request) {
        String genderStr = request.getGender() != null ? request.getGender() : "Belirtilmemiş";
        String focusMusclesStr = (request.getFocusMuscles() != null && !request.getFocusMuscles().isEmpty()) 
                ? String.join(", ", request.getFocusMuscles()) 
                : "Tüm vücut";
        String equipmentsStr = (request.getEquipments() != null && !request.getEquipments().isEmpty()) 
                ? String.join(", ", request.getEquipments()) 
                : "Vücut ağırlığı";

        String levelContext = "";
        if ("Başlangıç".equalsIgnoreCase(request.getLevel())) {
            levelContext = "FOR BEGINNERS (Başlangıç): Focus on high reps (12-15), moderate 2-3 sets, emphasize perfect form over weight. Use longer rest periods (90-120 saniye).";
        } else if ("İleri".equalsIgnoreCase(request.getLevel())) {
            levelContext = "FOR ADVANCED (İleri): Focus on high intensity. Lower reps (6-10) for strength and volume, 4-5 sets. Include progressive overload cues. Shorter rest periods (60-90 saniye) for intensity.";
        } else {
            levelContext = "FOR INTERMEDIATE (Orta): Balanced hypertrophy focus. 8-12 reps, 3-4 sets. Standard 60-90 saniye rest.";
        }

        return "You are an elite level personal trainer and sports scientist. I need a strictly formatted JSON workout plan for a " + genderStr + " user with the goal: " + request.getGoal() + ". " +
                "--- USER CONTEXT ---\n" +
                "Level: " + request.getLevel() + ". " + levelContext + "\n" +
                "Days per week: " + request.getDaysPerWeek() + ".\n" +
                "Focus Muscles: " + focusMusclesStr + ".\n" +
                "Available Equipment: " + equipmentsStr + ".\n" +
                "Extra Information (Injuries/Form): " + request.getExtraInformation() + ".\n" +
                "--- STRUCTURAL RULES ---\n" +
                "1. Warmup: DO NOT include warmup exercises. Focus only on the main workout.\n" +
                "2. Exercise Order: Start with heavy compound movements and move to isolation movements later.\n" +
                "3. Variety: Do not repeat the same exercise twice in a plan.\n" +
                "4. Safety: Adjust sets and reps strictly according to the level guidelines provided above.\n" +
                "--- CRITICAL LANGUAGE RULE ---\n" +
                "ALL textual values like 'dayName' and 'rest' MUST BE IN NATIVE TURKISH. Use terms like '90 saniye dinlenme', '60 saniye'.\n" +
                "--- JSON OUTPUT FORMAT ---\n" +
                "ONLY output valid JSON without markdown formatting. Format must be exactly:\n" +
                "{ \"days\": [ { \"dayName\": \"1. Gün...\", \"exercises\": [ { \"targetMuscle\": \"pectorals\", \"sets\": 3, \"reps\": 12, \"rest\": \"90 sn\" } ] } ] }.\n" +
                "Valid targetMuscles: [abs, biceps, calves, delts, forearms, glutes, lats, pectorals, spine, triceps, upper back, quadriceps, hamstrings, traps].";
    }

private void enrichWithLocalData(ObjectNode planNode, List<String> availableEquipments) {
    Random random = new Random();
    if (planNode.has("days")) {
        ArrayNode days = (ArrayNode) planNode.get("days");
        for (JsonNode dayNode : days) {
            // Enrich regular exercises
            if (dayNode.has("exercises")) {
                enrichExerciseArray((ArrayNode) dayNode.get("exercises"), availableEquipments, random);
            }
        }
    }
}

private void enrichExerciseArray(ArrayNode exercisesArray, List<String> availableEquipments, Random random) {
    for (JsonNode exerciseNode : exercisesArray) {
        String targetMuscle = exerciseNode.path("targetMuscle").asText().toLowerCase();
        String aiSuggestedName = exerciseNode.path("exerciseName").asText("");

        List<ExerciseDataDto> matches = exercises.stream()
                .filter(e -> (e.getTargetMuscles() != null && e.getTargetMuscles().contains(targetMuscle)) ||
                        (e.getSecondaryMuscles() != null && e.getSecondaryMuscles().contains(targetMuscle)) ||
                        (aiSuggestedName != null && !aiSuggestedName.isEmpty() && e.getName().toLowerCase().contains(aiSuggestedName.toLowerCase())))
                .filter(e -> {
                    if (availableEquipments == null || availableEquipments.isEmpty()) return true;
                    if (e.getEquipments() == null || e.getEquipments().isEmpty()) return true;
                    for (String eq : e.getEquipments()) {
                        for (String userEq : availableEquipments) {
                            if (eq.toLowerCase().contains(userEq.toLowerCase()) || userEq.toLowerCase().contains(eq.toLowerCase())) {
                                return true;
                            }
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());

        if (matches.isEmpty() && !exercises.isEmpty()) {
            matches = exercises.stream()
                    .filter(e -> (e.getTargetMuscles() != null && e.getTargetMuscles().contains(targetMuscle)))
                    .collect(Collectors.toList());
        }

        ObjectNode modifiableExercise = (ObjectNode) exerciseNode;
        if (!matches.isEmpty()) {
            ExerciseDataDto chosen = matches.get(random.nextInt(matches.size()));
            modifiableExercise.put("exerciseName", chosen.getName());
            modifiableExercise.put("gifUrl", chosen.getGifUrl());

            ArrayNode instructions = objectMapper.createArrayNode();
            if (chosen.getInstructions() != null) {
                chosen.getInstructions().forEach(instructions::add);
            }
            modifiableExercise.set("instructions", instructions);
        } else {
            // Last resort fallback
            if (!exercises.isEmpty()) {
                ExerciseDataDto fallback = exercises.get(random.nextInt(exercises.size()));
                if (modifiableExercise.path("exerciseName").isMissingNode() || modifiableExercise.path("exerciseName").asText().isEmpty()) {
                    modifiableExercise.put("exerciseName", fallback.getName() + " (Alternatif)");
                }
                modifiableExercise.put("gifUrl", fallback.getGifUrl());
                ArrayNode inst = objectMapper.createArrayNode();
                if (fallback.getInstructions() != null) fallback.getInstructions().forEach(inst::add);
                modifiableExercise.set("instructions", inst);
            }
        }
    }
}
}
