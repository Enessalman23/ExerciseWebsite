import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "dashboard_subtitle": "Are you ready to reach a new peak today?",
      "body_analysis": "Body Analysis",
      "complete_profile": "Complete your profile to get started.",
      "create_profile": "Create Profile",
      "bmi": "Body Mass Index",
      "daily_calorie_goal": "Daily Calorie Goal",
      "basal_metabolism": "Basal Metabolism",
      "interactive_anatomy": "Interactive Anatomy Discovery",
      "active_diet": "Active Diet",
      "plan": "Plan",
      "journal": "Journal",
      "no_diet_plan": "You don't have a diet plan yet.",
      "daily_energy_intake": "Targeted daily energy intake.",
      "active_workout": "Active Workout",
      "start": "Start",
      "no_workout_plan": "You don't have a workout plan yet.",
      "keep_up_discipline": "Keep up your weekly discipline!",
      "ready": "Ready",
      "next": "Next",
      // Navbar & Sidebar
      "logout": "Logout",
      "home": "Home",
      "workouts": "Workouts",
      "diet_plan": "Diet Plan",
      "nutrition_journal": "Nutrition Journal",
      "ai_coach": "AI Coach",
      "calories": "Calories (BMR)",
      "profile": "My Profile"
    }
  },
  tr: {
    translation: {
      "welcome": "Hoş geldin",
      "dashboard_subtitle": "Bugün yeni bir zirveye ulaşmaya hazır mısın?",
      "body_analysis": "Vücut Analizi",
      "complete_profile": "Başlamak için profilini tamamla.",
      "create_profile": "Profil Oluştur",
      "bmi": "Vücut Kitle Endeksi",
      "daily_calorie_goal": "Günlük Kalori Hedefi",
      "basal_metabolism": "Bazal Metabolizma",
      "interactive_anatomy": "Etkileşimli Egzersiz Keşfi",
      "active_diet": "Aktif Diyet",
      "plan": "Plan",
      "journal": "Günlük Kaydı",
      "no_diet_plan": "Henüz diyet planın yok.",
      "daily_energy_intake": "Hedeflenen günlük enerji alımı.",
      "active_workout": "Aktif Program",
      "start": "Başlat",
      "no_workout_plan": "Henüz programın yok.",
      "keep_up_discipline": "Haftalık disiplinine devam et!",
      "ready": "Hazır",
      "next": "Sıradaki",
      // Navbar & Sidebar
      "logout": "Çıkış Yap",
      "home": "Ana Sayfa",
      "workouts": "Antrenmanlar",
      "diet_plan": "Diyet Planı",
      "nutrition_journal": "Beslenme Günlüğü",
      "ai_coach": "AI Antrenör",
      "calories": "Kalori (BMR)",
      "profile": "Profilim"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "tr", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
