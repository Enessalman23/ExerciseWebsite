package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dto.ExerciseDataDto;
import dto.request.AiWorkoutRequest;
import dto.response.AiWorkoutResponse;
import entity.User;
import entity.WorkoutPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import repository.WorkoutPlanRepository;
import repository.UserMetricsRepository;
import entity.UserMetrics;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiGenerationService {

    private final GeminiClientService geminiClientService;
    private final ExerciseService exerciseService;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final UserMetricsRepository userMetricsRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiWorkoutResponse generateWorkout(AiWorkoutRequest request, User user) {
        String injuries = "";
        try {
            Optional<UserMetrics> metricsOpt = userMetricsRepository.findFirstByUserOrderByRecordedAtDesc(user);
            if (metricsOpt.isPresent() && metricsOpt.get().getInjuries() != null) {
                injuries = metricsOpt.get().getInjuries();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch user injuries: " + e.getMessage());
        }

        String prompt = buildPrompt(request, injuries);

        try {
            String jsonContent = geminiClientService.generateContent(prompt, 3, true);
            JsonNode generatedPlan = objectMapper.readTree(jsonContent);
            
            enrichWithLocalData((ObjectNode) generatedPlan, request.getEquipments());

            WorkoutPlan plan = new WorkoutPlan();
            plan.setUser(user);
            plan.setGeneratedPlanJson(objectMapper.writeValueAsString(generatedPlan));
            plan.setPlanName(request.getPlanName());
            plan.setActive(true);
            plan = workoutPlanRepository.save(plan);

            return new AiWorkoutResponse(plan.getId(), plan.getGeneratedPlanJson(), "Workout created successfully!", plan.getPlanName());

        } catch (Exception e) {
            throw new RuntimeException("Failed to process AI workout plan: " + e.getMessage(), e);
        }
    }
    private String buildPrompt(AiWorkoutRequest request, String injuries) {
        String genderStr = request.getGender() != null ? request.getGender() : "Belirtilmemiş";
        String focusMusclesStr = (request.getFocusMuscles() != null && !request.getFocusMuscles().isEmpty()) 
                ? String.join(", ", request.getFocusMuscles()) 
                : "Tüm vücut";
        String equipmentsStr = (request.getEquipments() != null && !request.getEquipments().isEmpty()) 
                ? String.join(", ", request.getEquipments()) 
                : "Vücut ağırlığı";

        String levelContext = "";
        if ("Başlangıç".equalsIgnoreCase(request.getLevel())) {
            levelContext = "FOR BEGINNERS: Focus on RPE 6-7 (leaving 3-4 reps in the tank). High reps (12-15) for neuromuscular adaptation. Priority: Machine-based and stable bodyweight movements. NO high-impact or complex Olympic lifts.";
        } else if ("İleri".equalsIgnoreCase(request.getLevel())) {
            levelContext = "FOR ADVANCED: Focus on RPE 8-9 (leaving 1-2 reps in the tank). Lower reps (6-10) for myofibrillar hypertrophy. Include techniques like 'slow eccentric' or 'pause reps' to increase time under tension safely.";
        } else {
            levelContext = "FOR INTERMEDIATE: Focus on RPE 7-8. Standard 8-12 reps. Balanced approach between volume and intensity.";
        }

        String splitInstruction = "";
        int days = request.getDaysPerWeek();

        if (days == 1) {
            splitInstruction = "STRUCTURE: Full Body (Tüm Vücut). Ensure a 1:1 ratio of Push to Pull movements to maintain posture.";
        } else if (days == 2) {
            splitInstruction = "STRUCTURE: Upper/Lower Split. Focus on fundamental movement patterns: Squat, Hinge, Push, Pull.";
        } else if (days == 3) {
            splitInstruction = "STRUCTURE: Push/Pull/Legs. Day 1: Push, Day 2: Pull, Day 3: Legs. Ensure each day includes at least one compound movement.";
        } else if (days == 4) {
            splitInstruction = "STRUCTURE: 4-Day Split (Upper/Lower or Push/Pull split). Prioritize symmetry and structural balance.";
        } else if (days >= 5) {
            splitInstruction = "STRUCTURE: 5-Day Hypertrophy Split. Limit high-RPE sets to 2 per muscle group to prevent CNS fatigue.";
        }

        String injuryDirective = "";
        if (injuries != null && !injuries.trim().isEmpty()) {
            injuryDirective = "\n--- CRITICAL MEDICAL/SAFETY PROTOCOL (INJURIES DETECTED) ---\n" +
                    "The user has reported the following active injuries/medical limitations: \"" + injuries + "\".\n" +
                    "1. AVOID RISKY MOVEMENTS: You MUST ABSOLUTELY avoid any exercises that put stress on or exacerbate these injuries. For example, if there is a knee injury, completely avoid heavy Squats, Lunges, Leg Press. If there is a shoulder impingement, avoid heavy overhead barbell lifting. If there are lower back issues, avoid traditional Deadlifts or heavy back squats.\n" +
                    "2. SAFE ALTERNATIVES: Select safe, highly stable alternative exercises targeting the same or nearby muscles safely (e.g., Leg Extensions/Glute Bridges for knee issues, machine chest press or lateral raises for shoulder issues).\n" +
                    "3. MARK REPLACEMENTS: For EVERY exercise in the JSON output, you MUST populate these three custom safety fields:\n" +
                    "   - \"isAlternative\": true if this exercise was chosen as a safe alternative to avoid injury stress, or false otherwise.\n" +
                    "   - \"replacedExercise\": the name of the standard/risky exercise that was avoided (e.g. \"Barbell Back Squat\"), or null if none.\n" +
                    "   - \"injuryReason\": a brief explanation of why the replacement occurred based on the injury (e.g. \"Diz sakatlığı güvenliği\"), or null if none.\n";
        }

        return "You are a PhD-level Sports Scientist and Elite Personal Trainer. I need a strictly formatted JSON workout plan for a " + genderStr + " user with the goal: " + request.getGoal() + ". " +
                "--- SPORTS SCIENCE & SAFETY PROTOCOL ---\n" +
                "1. ANTAGONIST BALANCE: For every PUSH movement, there MUST be a PULL movement of similar volume.\n" +
                "2. RPE CUES: Use 'Hissedilen Zorluk' (RPE) to guide intensity safely.\n" +
                "3. FORM OVER WEIGHT: Prioritize controlled eccentric phase.\n" +
                injuryDirective +
                "--- TRAINING ARCHITECTURE ---\n" +
                splitInstruction + "\n" +
                "--- USER CONTEXT ---\n" +
                "Level: " + request.getLevel() + ". " + levelContext + "\n" +
                "Days per week: " + days + ".\n" +
                "Available Equipment: " + equipmentsStr + ".\n" +
                "Extra Info: " + request.getExtraInformation() + ".\n" +
                "--- STRUCTURAL RULES ---\n" +
                "1. Warmup: DO NOT include warmup exercises. Focus only on the main workout.\n" +
                "2. NAMING: Use standard names like 'Barbell Bench Press', 'Dumbbell Row', 'Lunge', 'Push-up'. ALWAYS include the equipment in the name (Barbell, Dumbbell, Cable, Bodyweight).\n" +
                "3. VARIETY: ABSOLUTELY NO DUPLICATES across all " + days + " days.\n" +
                "--- JSON OUTPUT FORMAT ---\n" +
                "ONLY output valid JSON. Format exactly:\n" +
                "{ \"days\": [ { \"dayName\": \"1. Gün...\", \"exercises\": [ { \"exerciseName\": \"Example\", \"targetMuscle\": \"pectorals\", \"sets\": 3, \"reps\": 12, \"rest\": \"90 sn\", \"isAlternative\": false, \"replacedExercise\": null, \"injuryReason\": null } ] } ] }.";
    }

    private void enrichWithLocalData(ObjectNode planNode, List<String> availableEquipments) {
        Random random = new Random();
        Set<String> usedExerciseIds = new HashSet<>();
        List<ExerciseDataDto> warmups = exerciseService.getWarmupExercises();

        if (planNode.has("days")) {
            ArrayNode days = (ArrayNode) planNode.get("days");
            for (JsonNode dayNode : days) {
                ObjectNode dayObj = (ObjectNode) dayNode;
                
                // Add warmup exercises (3-4 random selections from warmup-eligible database)
                ArrayNode warmupArray = dayObj.putArray("warmupExercises");
                if (!warmups.isEmpty()) {
                    List<ExerciseDataDto> shuffledWarmups = new ArrayList<>(warmups);
                    Collections.shuffle(shuffledWarmups);
                    int count = 3 + random.nextInt(2); // 3 to 4 exercises
                    for (int i = 0; i < Math.min(count, shuffledWarmups.size()); i++) {
                        ExerciseDataDto w = shuffledWarmups.get(i);
                        ObjectNode wNode = warmupArray.addObject();
                        wNode.put("exerciseId", w.getExerciseId());
                        wNode.put("exerciseName", w.getName());
                        wNode.put("gifUrl", w.getGifUrl());
                        wNode.put("sets", "1");
                        wNode.put("reps", "10-15");
                        wNode.put("rest", "30 sn");
                        
                        ArrayNode imgs = wNode.putArray("images");
                        if (w.getImages() != null) w.getImages().forEach(imgs::add);
                        
                        ArrayNode instructions = wNode.putArray("instructions");
                        if (w.getInstructions() != null) w.getInstructions().forEach(instructions::add);
                    }
                }

                // Enrich regular exercises
                if (dayNode.has("exercises")) {
                    enrichExerciseArray((ArrayNode) dayNode.get("exercises"), availableEquipments, random, usedExerciseIds);
                }
            }
        }
    }

    private void enrichExerciseArray(ArrayNode exercisesArray, List<String> availableEquipments, Random random, Set<String> usedExerciseIds) {
        for (JsonNode exerciseNode : exercisesArray) {
            String targetMuscle = exerciseNode.path("targetMuscle").asText().toLowerCase();
            String rawAiName = exerciseNode.path("exerciseName").asText("");
            
            // Clean name (Remove RPE and common fluff)
            String cleanAiName = rawAiName.replaceAll("\\(RPE.*?\\)", "")
                    .replaceAll("(?i)exercise", "")
                    .trim();

            List<ExerciseDataDto> exercises = exerciseService.getExercisesCache();
            
            // Scored Matching Algorithm
            List<ExerciseDataDto> scoredMatches = exercises.stream()
                    .filter(e -> !usedExerciseIds.contains(e.getExerciseId()))
                    .map(e -> {
                        int score = 0;
                        String dbName = e.getName().toLowerCase();
                        String aiName = cleanAiName.toLowerCase();
                        
                        // Exact match is king
                        if (dbName.equals(aiName)) score += 100;
                        
                        // Keyword matches
                        String[] keywords = aiName.split("\\s+");
                        for (String kw : keywords) {
                            if (kw.length() < 3) continue;
                            if (dbName.contains(kw)) score += 10;
                        }

                        // Equipment synergy
                        if (aiName.contains("barbell") && dbName.contains("barbell")) score += 20;
                        if (aiName.contains("dumbbell") && dbName.contains("dumbbell")) score += 20;
                        if (aiName.contains("cable") && dbName.contains("cable")) score += 20;

                        // Muscle synergy
                        if (e.getTargetMuscles() != null && e.getTargetMuscles().contains(targetMuscle)) {
                            score += 5;
                        }

                        return new AbstractMap.SimpleEntry<>(e, score);
                    })
                    .filter(entry -> entry.getValue() > 0)
                    .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                    .limit(10)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            ObjectNode modifiableExercise = (ObjectNode) exerciseNode;
            if (!scoredMatches.isEmpty()) {
                // Pick from top 3 matches to keep some variety but maintain high relevance
                ExerciseDataDto chosen = scoredMatches.get(random.nextInt(Math.min(3, scoredMatches.size())));
                usedExerciseIds.add(chosen.getExerciseId());
                
                modifiableExercise.put("exerciseName", rawAiName); 
                modifiableExercise.put("gifUrl", chosen.getGifUrl());

                ArrayNode imagesNode = objectMapper.createArrayNode();
                if (chosen.getImages() != null) chosen.getImages().forEach(imagesNode::add);
                modifiableExercise.set("images", imagesNode);

                ArrayNode instructions = objectMapper.createArrayNode();
                if (chosen.getInstructions() != null) chosen.getInstructions().forEach(instructions::add);
                modifiableExercise.set("instructions", instructions);
            } else {
                // Relaxed Fallback
                List<ExerciseDataDto> fallbackMatches = exercises.stream()
                        .filter(e -> (e.getTargetMuscles() != null && e.getTargetMuscles().contains(targetMuscle)))
                        .collect(Collectors.toList());
                
                if (!fallbackMatches.isEmpty()) {
                    ExerciseDataDto fallback = fallbackMatches.get(random.nextInt(fallbackMatches.size()));
                    modifiableExercise.put("gifUrl", fallback.getGifUrl());
                    ArrayNode inst = objectMapper.createArrayNode();
                    if (fallback.getInstructions() != null) fallback.getInstructions().forEach(inst::add);
                    modifiableExercise.set("instructions", inst);
                }
            }
        }
    }
}
