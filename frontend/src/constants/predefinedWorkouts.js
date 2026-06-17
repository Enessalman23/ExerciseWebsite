export const PREDEFINED_WORKOUTS = [
  {
    workoutPlanId: "predefined_fullbody",
    planName: "Tüm Vücut (Full Body) Temel Güç Programı 🏋️‍♂️",
    createdAt: "2026-06-17T00:00:00",
    workoutPlanJson: JSON.stringify({
      days: [
        {
          dayName: "1. Gün: Güç ve Bileşik Egzersizler",
          warmupExercises: [
            {
              exerciseId: "Ankle_Circles",
              exerciseName: "Ankle Circles",
              sets: "1",
              reps: "10-12",
              rest: "30 sn",
              images: ["Ankle_Circles/images/0.jpg", "Ankle_Circles/images/1.jpg"],
              gifUrl: "Ankle_Circles/images/0.jpg"
            },
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "10-12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Squat",
              targetMuscle: "quadriceps",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Barbell_Squat/images/0.jpg", "Barbell_Squat/images/1.jpg"],
              gifUrl: "Barbell_Squat/images/0.jpg"
            },
            {
              exerciseName: "Barbell Bench Press - Medium Grip",
              targetMuscle: "chest",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Barbell_Bench_Press_-_Medium_Grip/images/0.jpg", "Barbell_Bench_Press_-_Medium_Grip/images/1.jpg"],
              gifUrl: "Barbell_Bench_Press_-_Medium_Grip/images/0.jpg"
            },
            {
              exerciseName: "Bent Over Barbell Row",
              targetMuscle: "upper-back",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Bent_Over_Barbell_Row/images/0.jpg", "Bent_Over_Barbell_Row/images/1.jpg"],
              gifUrl: "Bent_Over_Barbell_Row/images/0.jpg"
            },
            {
              exerciseName: "Pushups",
              targetMuscle: "chest",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Pushups/images/0.jpg", "Pushups/images/1.jpg"],
              gifUrl: "Pushups/images/0.jpg"
            },
            {
              exerciseName: "Barbell Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Barbell_Curl/images/0.jpg", "Barbell_Curl/images/1.jpg"],
              gifUrl: "Barbell_Curl/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            }
          ]
        },
        {
          dayName: "2. Gün: Posterior Chain ve Omuz",
          warmupExercises: [
            {
              exerciseId: "Elbow_Circles",
              exerciseName: "Elbow Circles",
              sets: "1",
              reps: "12-15",
              rest: "30 sn",
              images: ["Elbow_Circles/images/0.jpg", "Elbow_Circles/images/1.jpg"],
              gifUrl: "Elbow_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Deadlift",
              targetMuscle: "hamstring",
              sets: 4,
              reps: 6,
              rest: "120 sn",
              images: ["Barbell_Deadlift/images/0.jpg", "Barbell_Deadlift/images/1.jpg"],
              gifUrl: "Barbell_Deadlift/images/0.jpg"
            },
            {
              exerciseName: "Dumbbell Shoulder Press",
              targetMuscle: "shoulders",
              sets: 4,
              reps: 10,
              rest: "90 sn",
              images: ["Dumbbell_Shoulder_Press/images/0.jpg", "Dumbbell_Shoulder_Press/images/1.jpg"],
              gifUrl: "Dumbbell_Shoulder_Press/images/0.jpg"
            },
            {
              exerciseName: "Pullups",
              targetMuscle: "upper-back",
              sets: 3,
              reps: 8,
              rest: "90 sn",
              images: ["Pullups/images/0.jpg", "Pullups/images/1.jpg"],
              gifUrl: "Pullups/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 60,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Alternate Hammer Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Alternate_Hammer_Curl/images/0.jpg", "Alternate_Hammer_Curl/images/1.jpg"],
              gifUrl: "Alternate_Hammer_Curl/images/0.jpg"
            },
            {
              exerciseName: "Standing Calf Raises",
              targetMuscle: "calves",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Standing_Calf_Raises/images/0.jpg", "Standing_Calf_Raises/images/1.jpg"],
              gifUrl: "Standing_Calf_Raises/images/0.jpg"
            }
          ]
        },
        {
          dayName: "3. Gün: Hipertrofi ve Dayanıklılık",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Goblet Squat",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 12,
              rest: "90 sn",
              images: ["Goblet_Squat/images/0.jpg", "Goblet_Squat/images/1.jpg"],
              gifUrl: "Goblet_Squat/images/0.jpg"
            },
            {
              exerciseName: "Incline Dumbbell Press",
              targetMuscle: "chest",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Incline_Dumbbell_Press/images/0.jpg", "Incline_Dumbbell_Press/images/1.jpg"],
              gifUrl: "Incline_Dumbbell_Press/images/0.jpg"
            },
            {
              exerciseName: "Chin-Up",
              targetMuscle: "upper-back",
              sets: 3,
              reps: 8,
              rest: "90 sn",
              images: ["Chin-Up/images/0.jpg", "Chin-Up/images/1.jpg"],
              gifUrl: "Chin-Up/images/0.jpg"
            },
            {
              exerciseName: "Triceps Pushdown - Rope Attachment",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Triceps_Pushdown_-_Rope_Attachment/images/0.jpg", "Triceps_Pushdown_-_Rope_Attachment/images/1.jpg"],
              gifUrl: "Triceps_Pushdown_-_Rope_Attachment/images/0.jpg"
            },
            {
              exerciseName: "Side Lateral Raise",
              targetMuscle: "shoulders",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Side_Lateral_Raise/images/0.jpg", "Side_Lateral_Raise/images/1.jpg"],
              gifUrl: "Side_Lateral_Raise/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            }
          ]
        }
      ]
    })
  },
  {
    workoutPlanId: "predefined_ppl",
    planName: "İtme / Çekme / Bacak (PPL) Klasik Split 🔥",
    createdAt: "2026-06-17T00:00:00",
    workoutPlanJson: JSON.stringify({
      days: [
        {
          dayName: "1. Gün: İtme (Push) - Göğüs, Omuz, Triceps",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Bench Press - Medium Grip",
              targetMuscle: "chest",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Barbell_Bench_Press_-_Medium_Grip/images/0.jpg", "Barbell_Bench_Press_-_Medium_Grip/images/1.jpg"],
              gifUrl: "Barbell_Bench_Press_-_Medium_Grip/images/0.jpg"
            },
            {
              exerciseName: "Arnold Dumbbell Press",
              targetMuscle: "shoulders",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Arnold_Dumbbell_Press/images/0.jpg", "Arnold_Dumbbell_Press/images/1.jpg"],
              gifUrl: "Arnold_Dumbbell_Press/images/0.jpg"
            },
            {
              exerciseName: "Incline Dumbbell Flyes",
              targetMuscle: "chest",
              sets: 3,
              reps: 12,
              rest: "75 sn",
              images: ["Incline_Dumbbell_Flyes/images/0.jpg", "Incline_Dumbbell_Flyes/images/1.jpg"],
              gifUrl: "Incline_Dumbbell_Flyes/images/0.jpg"
            },
            {
              exerciseName: "Bench Dips",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bench_Dips/images/0.jpg", "Bench_Dips/images/1.jpg"],
              gifUrl: "Bench_Dips/images/0.jpg"
            },
            {
              exerciseName: "Side Lateral Raise",
              targetMuscle: "shoulders",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Side_Lateral_Raise/images/0.jpg", "Side_Lateral_Raise/images/1.jpg"],
              gifUrl: "Side_Lateral_Raise/images/0.jpg"
            },
            {
              exerciseName: "Pushups",
              targetMuscle: "chest",
              sets: 3,
              reps: 15,
              rest: "60 sn",
              images: ["Pushups/images/0.jpg", "Pushups/images/1.jpg"],
              gifUrl: "Pushups/images/0.jpg"
            }
          ]
        },
        {
          dayName: "2. Gün: Çekme (Pull) - Sırt, Biceps",
          warmupExercises: [
            {
              exerciseId: "Elbow_Circles",
              exerciseName: "Elbow Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Elbow_Circles/images/0.jpg", "Elbow_Circles/images/1.jpg"],
              gifUrl: "Elbow_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Chin-Up",
              targetMuscle: "upper-back",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Chin-Up/images/0.jpg", "Chin-Up/images/1.jpg"],
              gifUrl: "Chin-Up/images/0.jpg"
            },
            {
              exerciseName: "One-Arm Dumbbell Row",
              targetMuscle: "upper-back",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["One-Arm_Dumbbell_Row/images/0.jpg", "One-Arm_Dumbbell_Row/images/1.jpg"],
              gifUrl: "One-Arm_Dumbbell_Row/images/0.jpg"
            },
            {
              exerciseName: "Dumbbell Bicep Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Dumbbell_Bicep_Curl/images/0.jpg", "Dumbbell_Bicep_Curl/images/1.jpg"],
              gifUrl: "Dumbbell_Bicep_Curl/images/0.jpg"
            },
            {
              exerciseName: "Barbell Shrug",
              targetMuscle: "trapezius",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Barbell_Shrug/images/0.jpg", "Barbell_Shrug/images/1.jpg"],
              gifUrl: "Barbell_Shrug/images/0.jpg"
            },
            {
              exerciseName: "Alternate Hammer Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Alternate_Hammer_Curl/images/0.jpg", "Alternate_Hammer_Curl/images/1.jpg"],
              gifUrl: "Alternate_Hammer_Curl/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            }
          ]
        },
        {
          dayName: "3. Gün: Bacak (Legs) - Quadriceps, Hamstrings",
          warmupExercises: [
            {
              exerciseId: "Ankle_Circles",
              exerciseName: "Ankle Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Ankle_Circles/images/0.jpg", "Ankle_Circles/images/1.jpg"],
              gifUrl: "Ankle_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Squat",
              targetMuscle: "quadriceps",
              sets: 4,
              reps: 8,
              rest: "120 sn",
              images: ["Barbell_Squat/images/0.jpg", "Barbell_Squat/images/1.jpg"],
              gifUrl: "Barbell_Squat/images/0.jpg"
            },
            {
              exerciseName: "Romanian Deadlift",
              targetMuscle: "hamstring",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Romanian_Deadlift/images/0.jpg", "Romanian_Deadlift/images/1.jpg"],
              gifUrl: "Romanian_Deadlift/images/0.jpg"
            },
            {
              exerciseName: "Lying Leg Curls",
              targetMuscle: "hamstring",
              sets: 3,
              reps: 12,
              rest: "75 sn",
              images: ["Lying_Leg_Curls/images/0.jpg", "Lying_Leg_Curls/images/1.jpg"],
              gifUrl: "Lying_Leg_Curls/images/0.jpg"
            },
            {
              exerciseName: "Standing Calf Raises",
              targetMuscle: "calves",
              sets: 3,
              reps: 15,
              rest: "60 sn",
              images: ["Standing_Calf_Raises/images/0.jpg", "Standing_Calf_Raises/images/1.jpg"],
              gifUrl: "Standing_Calf_Raises/images/0.jpg"
            },
            {
              exerciseName: "Bodyweight Walking Lunge",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bodyweight_Walking_Lunge/images/0.jpg", "Bodyweight_Walking_Lunge/images/1.jpg"],
              gifUrl: "Bodyweight_Walking_Lunge/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            }
          ]
        }
      ]
    })
  },
  {
    workoutPlanId: "predefined_calisthenics",
    planName: "Evde Ekipmansız Vücut Ağırlığı (Calisthenics) 🏠",
    createdAt: "2026-06-17T00:00:00",
    workoutPlanJson: JSON.stringify({
      days: [
        {
          dayName: "1. Gün: Üst Vücut & Core Dayanıklılığı",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Pushups",
              targetMuscle: "chest",
              sets: 3,
              reps: 15,
              rest: "60 sn",
              images: ["Pushups/images/0.jpg", "Pushups/images/1.jpg"],
              gifUrl: "Pushups/images/0.jpg"
            },
            {
              exerciseName: "Bench Dips",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bench_Dips/images/0.jpg", "Bench_Dips/images/1.jpg"],
              gifUrl: "Bench_Dips/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            },
            {
              exerciseName: "Butt-Ups",
              targetMuscle: "abs",
              sets: 3,
              reps: 12,
              rest: "45 sn",
              images: ["Butt-Ups/images/0.jpg", "Butt-Ups/images/1.jpg"],
              gifUrl: "Butt-Ups/images/0.jpg"
            },
            {
              exerciseName: "Mountain Climbers",
              targetMuscle: "abs",
              sets: 3,
              reps: 25,
              rest: "45 sn",
              images: ["Mountain_Climbers/images/0.jpg", "Mountain_Climbers/images/1.jpg"],
              gifUrl: "Mountain_Climbers/images/0.jpg"
            }
          ]
        },
        {
          dayName: "2. Gün: Alt Vücut ve Stabilizasyon",
          warmupExercises: [
            {
              exerciseId: "Ankle_Circles",
              exerciseName: "Ankle Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Ankle_Circles/images/0.jpg", "Ankle_Circles/images/1.jpg"],
              gifUrl: "Ankle_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Bodyweight Squat",
              targetMuscle: "quadriceps",
              sets: 4,
              reps: 20,
              rest: "60 sn",
              images: ["Bodyweight_Squat/images/0.jpg", "Bodyweight_Squat/images/1.jpg"],
              gifUrl: "Bodyweight_Squat/images/0.jpg"
            },
            {
              exerciseName: "Bodyweight Walking Lunge",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bodyweight_Walking_Lunge/images/0.jpg", "Bodyweight_Walking_Lunge/images/1.jpg"],
              gifUrl: "Bodyweight_Walking_Lunge/images/0.jpg"
            },
            {
              exerciseName: "Single Leg Glute Bridge",
              targetMuscle: "glutes",
              sets: 3,
              reps: 12,
              rest: "45 sn",
              images: ["Single_Leg_Glute_Bridge/images/0.jpg", "Single_Leg_Glute_Bridge/images/1.jpg"],
              gifUrl: "Single_Leg_Glute_Bridge/images/0.jpg"
            },
            {
              exerciseName: "Side Bridge",
              targetMuscle: "obliques",
              sets: 3,
              reps: 30,
              rest: "45 sn",
              images: ["Side_Bridge/images/0.jpg", "Side_Bridge/images/1.jpg"],
              gifUrl: "Side_Bridge/images/0.jpg"
            },
            {
              exerciseName: "Mountain Climbers",
              targetMuscle: "abs",
              sets: 3,
              reps: 25,
              rest: "45 sn",
              images: ["Mountain_Climbers/images/0.jpg", "Mountain_Climbers/images/1.jpg"],
              gifUrl: "Mountain_Climbers/images/0.jpg"
            },
            {
              exerciseName: "Flutter Kicks",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Flutter_Kicks/images/0.jpg", "Flutter_Kicks/images/1.jpg"],
              gifUrl: "Flutter_Kicks/images/0.jpg"
            }
          ]
        },
        {
          dayName: "3. Gün: Kardiyo ve Yoğun Karın",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Incline Push-Up",
              targetMuscle: "chest",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Incline_Push-Up/images/0.jpg", "Incline_Push-Up/images/1.jpg"],
              gifUrl: "Incline_Push-Up/images/0.jpg"
            },
            {
              exerciseName: "Single Leg Glute Bridge",
              targetMuscle: "glutes",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Single_Leg_Glute_Bridge/images/0.jpg", "Single_Leg_Glute_Bridge/images/1.jpg"],
              gifUrl: "Single_Leg_Glute_Bridge/images/0.jpg"
            },
            {
              exerciseName: "Elbow to Knee",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Elbow_to_Knee/images/0.jpg", "Elbow_to_Knee/images/1.jpg"],
              gifUrl: "Elbow_to_Knee/images/0.jpg"
            },
            {
              exerciseName: "Flutter Kicks",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Flutter_Kicks/images/0.jpg", "Flutter_Kicks/images/1.jpg"],
              gifUrl: "Flutter_Kicks/images/0.jpg"
            },
            {
              exerciseName: "Bench Dips",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bench_Dips/images/0.jpg", "Bench_Dips/images/1.jpg"],
              gifUrl: "Bench_Dips/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "45 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            }
          ]
        }
      ]
    })
  },
  {
    workoutPlanId: "predefined_upperlower",
    planName: "4 Günlük Üst / Alt Vücut Güç Spliti ⚡",
    createdAt: "2026-06-17T00:00:00",
    workoutPlanJson: JSON.stringify({
      days: [
        {
          dayName: "1. Gün: Üst Vücut (Güç)",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Bench Press - Medium Grip",
              targetMuscle: "chest",
              sets: 4,
              reps: 6,
              rest: "90 sn",
              images: ["Barbell_Bench_Press_-_Medium_Grip/images/0.jpg", "Barbell_Bench_Press_-_Medium_Grip/images/1.jpg"],
              gifUrl: "Barbell_Bench_Press_-_Medium_Grip/images/0.jpg"
            },
            {
              exerciseName: "Bent Over Barbell Row",
              targetMuscle: "upper-back",
              sets: 4,
              reps: 8,
              rest: "90 sn",
              images: ["Bent_Over_Barbell_Row/images/0.jpg", "Bent_Over_Barbell_Row/images/1.jpg"],
              gifUrl: "Bent_Over_Barbell_Row/images/0.jpg"
            },
            {
              exerciseName: "Dumbbell Shoulder Press",
              targetMuscle: "shoulders",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Dumbbell_Shoulder_Press/images/0.jpg", "Dumbbell_Shoulder_Press/images/1.jpg"],
              gifUrl: "Dumbbell_Shoulder_Press/images/0.jpg"
            },
            {
              exerciseName: "Chin-Up",
              targetMuscle: "upper-back",
              sets: 3,
              reps: 8,
              rest: "90 sn",
              images: ["Chin-Up/images/0.jpg", "Chin-Up/images/1.jpg"],
              gifUrl: "Chin-Up/images/0.jpg"
            },
            {
              exerciseName: "Dumbbell Bicep Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Dumbbell_Bicep_Curl/images/0.jpg", "Dumbbell_Bicep_Curl/images/1.jpg"],
              gifUrl: "Dumbbell_Bicep_Curl/images/0.jpg"
            },
            {
              exerciseName: "Bench Dips",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bench_Dips/images/0.jpg", "Bench_Dips/images/1.jpg"],
              gifUrl: "Bench_Dips/images/0.jpg"
            }
          ]
        },
        {
          dayName: "2. Gün: Alt Vücut (Güç)",
          warmupExercises: [
            {
              exerciseId: "Ankle_Circles",
              exerciseName: "Ankle Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Ankle_Circles/images/0.jpg", "Ankle_Circles/images/1.jpg"],
              gifUrl: "Ankle_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Squat",
              targetMuscle: "quadriceps",
              sets: 4,
              reps: 6,
              rest: "120 sn",
              images: ["Barbell_Squat/images/0.jpg", "Barbell_Squat/images/1.jpg"],
              gifUrl: "Barbell_Squat/images/0.jpg"
            },
            {
              exerciseName: "Romanian Deadlift",
              targetMuscle: "hamstring",
              sets: 3,
              reps: 8,
              rest: "90 sn",
              images: ["Romanian_Deadlift/images/0.jpg", "Romanian_Deadlift/images/1.jpg"],
              gifUrl: "Romanian_Deadlift/images/0.jpg"
            },
            {
              exerciseName: "Leg Extensions",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 12,
              rest: "75 sn",
              images: ["Leg_Extensions/images/0.jpg", "Leg_Extensions/images/1.jpg"],
              gifUrl: "Leg_Extensions/images/0.jpg"
            },
            {
              exerciseName: "Standing Calf Raises",
              targetMuscle: "calves",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Standing_Calf_Raises/images/0.jpg", "Standing_Calf_Raises/images/1.jpg"],
              gifUrl: "Standing_Calf_Raises/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            }
          ]
        },
        {
          dayName: "3. Gün: Üst Vücut (Hacim)",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Incline Dumbbell Press",
              targetMuscle: "chest",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Incline_Dumbbell_Press/images/0.jpg", "Incline_Dumbbell_Press/images/1.jpg"],
              gifUrl: "Incline_Dumbbell_Press/images/0.jpg"
            },
            {
              exerciseName: "Pullups",
              targetMuscle: "upper-back",
              sets: 3,
              reps: 8,
              rest: "90 sn",
              images: ["Pullups/images/0.jpg", "Pullups/images/1.jpg"],
              gifUrl: "Pullups/images/0.jpg"
            },
            {
              exerciseName: "Dumbbell Shoulder Press",
              targetMuscle: "shoulders",
              sets: 3,
              reps: 10,
              rest: "75 sn",
              images: ["Dumbbell_Shoulder_Press/images/0.jpg", "Dumbbell_Shoulder_Press/images/1.jpg"],
              gifUrl: "Dumbbell_Shoulder_Press/images/0.jpg"
            },
            {
              exerciseName: "Alternate Hammer Curl",
              targetMuscle: "biceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Alternate_Hammer_Curl/images/0.jpg", "Alternate_Hammer_Curl/images/1.jpg"],
              gifUrl: "Alternate_Hammer_Curl/images/0.jpg"
            },
            {
              exerciseName: "Pushups",
              targetMuscle: "chest",
              sets: 3,
              reps: 15,
              rest: "60 sn",
              images: ["Pushups/images/0.jpg", "Pushups/images/1.jpg"],
              gifUrl: "Pushups/images/0.jpg"
            },
            {
              exerciseName: "Triceps Pushdown - Rope Attachment",
              targetMuscle: "triceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Triceps_Pushdown_-_Rope_Attachment/images/0.jpg", "Triceps_Pushdown_-_Rope_Attachment/images/1.jpg"],
              gifUrl: "Triceps_Pushdown_-_Rope_Attachment/images/0.jpg"
            }
          ]
        },
        {
          dayName: "4. Gün: Alt Vücut (Hacim)",
          warmupExercises: [
            {
              exerciseId: "Ankle_Circles",
              exerciseName: "Ankle Circles",
              sets: "1",
              reps: "15",
              rest: "30 sn",
              images: ["Ankle_Circles/images/0.jpg", "Ankle_Circles/images/1.jpg"],
              gifUrl: "Ankle_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Barbell Deadlift",
              targetMuscle: "hamstring",
              sets: 3,
              reps: 6,
              rest: "120 sn",
              images: ["Barbell_Deadlift/images/0.jpg", "Barbell_Deadlift/images/1.jpg"],
              gifUrl: "Barbell_Deadlift/images/0.jpg"
            },
            {
              exerciseName: "Goblet Squat",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 10,
              rest: "90 sn",
              images: ["Goblet_Squat/images/0.jpg", "Goblet_Squat/images/1.jpg"],
              gifUrl: "Goblet_Squat/images/0.jpg"
            },
            {
              exerciseName: "Lying Leg Curls",
              targetMuscle: "hamstring",
              sets: 3,
              reps: 12,
              rest: "75 sn",
              images: ["Lying_Leg_Curls/images/0.jpg", "Lying_Leg_Curls/images/1.jpg"],
              gifUrl: "Lying_Leg_Curls/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 60,
              rest: "60 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Bodyweight Walking Lunge",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 12,
              rest: "60 sn",
              images: ["Bodyweight_Walking_Lunge/images/0.jpg", "Bodyweight_Walking_Lunge/images/1.jpg"],
              gifUrl: "Bodyweight_Walking_Lunge/images/0.jpg"
            },
            {
              exerciseName: "Alternate Heel Touchers",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Alternate_Heel_Touchers/images/0.jpg", "Alternate_Heel_Touchers/images/1.jpg"],
              gifUrl: "Alternate_Heel_Touchers/images/0.jpg"
            }
          ]
        }
      ]
    })
  },
  {
    workoutPlanId: "predefined_cardio",
    planName: "Evde Karın ve Kardiyo (Yağ Yakım Odaklı) 🔥",
    createdAt: "2026-06-17T00:00:00",
    workoutPlanJson: JSON.stringify({
      days: [
        {
          dayName: "1. Gün: Yüksek Yoğunluklu Karın",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Mountain Climbers",
              targetMuscle: "abs",
              sets: 3,
              reps: 30,
              rest: "45 sn",
              images: ["Mountain_Climbers/images/0.jpg", "Mountain_Climbers/images/1.jpg"],
              gifUrl: "Mountain_Climbers/images/0.jpg"
            },
            {
              exerciseName: "Crunches",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Crunches/images/0.jpg", "Crunches/images/1.jpg"],
              gifUrl: "Crunches/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "45 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Flutter Kicks",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Flutter_Kicks/images/0.jpg", "Flutter_Kicks/images/1.jpg"],
              gifUrl: "Flutter_Kicks/images/0.jpg"
            },
            {
              exerciseName: "Air Bike",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Air_Bike/images/0.jpg", "Air_Bike/images/1.jpg"],
              gifUrl: "Air_Bike/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            }
          ]
        },
        {
          dayName: "2. Gün: Oblique ve Merkez Bölge",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Freehand Jump Squat",
              targetMuscle: "quadriceps",
              sets: 3,
              reps: 15,
              rest: "60 sn",
              images: ["Freehand_Jump_Squat/images/0.jpg", "Freehand_Jump_Squat/images/1.jpg"],
              gifUrl: "Freehand_Jump_Squat/images/0.jpg"
            },
            {
              exerciseName: "Russian Twist",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Russian_Twist/images/0.jpg", "Russian_Twist/images/1.jpg"],
              gifUrl: "Russian_Twist/images/0.jpg"
            },
            {
              exerciseName: "Alternate Heel Touchers",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Alternate_Heel_Touchers/images/0.jpg", "Alternate_Heel_Touchers/images/1.jpg"],
              gifUrl: "Alternate_Heel_Touchers/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "45 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            },
            {
              exerciseName: "Mountain Climbers",
              targetMuscle: "abs",
              sets: 3,
              reps: 25,
              rest: "45 sn",
              images: ["Mountain_Climbers/images/0.jpg", "Mountain_Climbers/images/1.jpg"],
              gifUrl: "Mountain_Climbers/images/0.jpg"
            }
          ]
        },
        {
          dayName: "3. Gün: Kardiyo Şampiyonu",
          warmupExercises: [
            {
              exerciseId: "Arm_Circles",
              exerciseName: "Arm Circles",
              sets: "1",
              reps: "12",
              rest: "30 sn",
              images: ["Arm_Circles/images/0.jpg", "Arm_Circles/images/1.jpg"],
              gifUrl: "Arm_Circles/images/0.jpg"
            }
          ],
          exercises: [
            {
              exerciseName: "Mountain Climbers",
              targetMuscle: "abs",
              sets: 4,
              reps: 30,
              rest: "45 sn",
              images: ["Mountain_Climbers/images/0.jpg", "Mountain_Climbers/images/1.jpg"],
              gifUrl: "Mountain_Climbers/images/0.jpg"
            },
            {
              exerciseName: "Flutter Kicks",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Flutter_Kicks/images/0.jpg", "Flutter_Kicks/images/1.jpg"],
              gifUrl: "Flutter_Kicks/images/0.jpg"
            },
            {
              exerciseName: "Cross-Body Crunch",
              targetMuscle: "abs",
              sets: 3,
              reps: 20,
              rest: "45 sn",
              images: ["Cross-Body_Crunch/images/0.jpg", "Cross-Body_Crunch/images/1.jpg"],
              gifUrl: "Cross-Body_Crunch/images/0.jpg"
            },
            {
              exerciseName: "Leg Lift",
              targetMuscle: "abs",
              sets: 3,
              reps: 12,
              rest: "45 sn",
              images: ["Leg_Lift/images/0.jpg", "Leg_Lift/images/1.jpg"],
              gifUrl: "Leg_Lift/images/0.jpg"
            },
            {
              exerciseName: "Sit-Up",
              targetMuscle: "abs",
              sets: 3,
              reps: 15,
              rest: "45 sn",
              images: ["Sit-Up/images/0.jpg", "Sit-Up/images/1.jpg"],
              gifUrl: "Sit-Up/images/0.jpg"
            },
            {
              exerciseName: "Plank",
              targetMuscle: "abs",
              sets: 3,
              reps: 45,
              rest: "45 sn",
              images: ["Plank/images/0.jpg", "Plank/images/1.jpg"],
              gifUrl: "Plank/images/0.jpg"
            }
          ]
        }
      ]
    })
  }
];
