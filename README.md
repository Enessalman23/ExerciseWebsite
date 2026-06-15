# 🏋️‍♂️ Yapay Zeka Destekli Web Tabanlı Egzersiz ve Beslenme Asistanı
### *AI-Powered Web-Based Fitness & Nutrition Assistant*

Bu proje, kullanıcıların fiziksel özelliklerine, sağlık geçmişlerine ve kişisel hedeflerine göre kişiselleştirilmiş antrenman ve beslenme planları oluşturan, tarayıcı kamerası üzerinden **MediaPipe** ile gerçek zamanlı hareket formu analizi gerçekleştiren ve **Google Gemini API** entegrasyonuyla akıllı koçluk hizmeti sunan full-stack bir web uygulamasıdır.

*This project is a full-stack web application that creates personalized workout and nutrition plans based on users' biometrics, health history, and goals. It features real-time exercise form analysis via **MediaPipe** using the browser camera and offers intelligent coaching through **Google Gemini API** integration.*

---

## 🚀 Teknolojiler ve Kütüphaneler / *Tech Stack*

### Backend
*   **Java 17** & **Spring Boot 4.0.5**
*   **Spring Security** & **JWT (JSON Web Token)** (Kimlik Doğrulama & Yetkilendirme)
*   **Spring Data JPA** & **PostgreSQL** (Veri Yönetimi)
*   **Caffeine Cache** (Performans Optimizasyonu)
*   **Google Gemini API (gemini-flash-latest)** (Yapay Zeka Karar Mekanizması & Sohbet Koçu)
*   **Springdoc OpenAPI / Swagger** (API Dokümantasyonu)

### Frontend
*   **React v19** (Component-based UI)
*   **Vite** (Build Tool)
*   **Zustand** (Küresel Durum Yönetimi / State Management)
*   **React Router Dom v7** (Dinamik Yönlendirme)
*   **MediaPipe Pose Landmarker** (Kamera Tabanlı Eklem/Açı Analizi)
*   **Recharts** (Gelişim Grafikleri ve İlerleme Görselleştirme)
*   **Lucide React** (Modern Arayüz İkonları)

---

## 🌟 Öne Çıkan Özellikler / *Key Features*

### 1. 🤖 Yapay Zeka Destekli Antrenman & Diyet Planlama (*AI Workout & Diet Planner*)
*   Kullanıcının yaş, boy, kilo, yağ oranı, sakatlık durumu ve hedeflerine göre kişiye özel haftalık egzersiz programları oluşturulur.
*   **Gemini API** ile bazal metabolizma hızı (BMR) hesabı temel alınarak kalori ve makro (protein, karbonhidrat, yağ) dengesine uygun, kişiselleştirilmiş diyet reçeteleri ve tarifler üretilir.

### 2. 🎥 Gerçek Zamanlı Form Analizi & Yapay Zeka Koçu (*Real-Time Pose Coach*)
*   **MediaPipe Pose** kütüphanesi kullanılarak kullanıcının kamera karşısında yaptığı **Squat (Çökme)** ve **Push-up (Şınav)** hareketlerinin eklem açıları gerçek zamanlı izlenir.
*   Hatalı duruşlar tespit edildiğinde kullanıcıya sesli ve görsel anlık geri bildirimler verilir, tekrar sayıları otomatik olarak sayılır.

### 3. 💬 Kişisel Sohbet Asistanı (*AI Personal Sports Coach*)
*   Kullanıcıların antrenman ve beslenme süreçlerine dair merak ettikleri tüm soruları sorabildikleri sesli yönlendirme destekli interaktif sohbet arayüzü.

### 4. 📸 Gelişim Galerisi & Beslenme Günlüğü (*Progress Gallery & Nutrition Diary*)
*   Kullanıcılar süreç içerisindeki fiziksel değişimlerini günlüklere kaydedebilir ve fotoğraflar yükleyerek görsel olarak gelişimlerini takip edebilir.
*   Besin analizi kısmında, tüketilen yemekler düz metin olarak girildiğinde veya tabağın fotoğrafı yüklendiğinde **Gemini Vision** ile kalori ve makro değerleri otomatik tahmin edilerek günlüğe eklenir.

---

## 📂 Proje Yapısı / *Project Structure*

```
├── backend/                  # Spring Boot Backend Projesi
│   ├── src/main/java/        # Java Kaynak Kodları
│   │   └── com/egzersiz/
│   │       ├── config/       # Güvenlik, MVC ve Cache Konfigürasyonları
│   │       ├── controller/   # API Endpoint Kontrolcüleri
│   │       ├── dto/          # Data Transfer Object (Veri Taşıma Nesneleri)
│   │       ├── entity/       # PostgreSQL JPA Varlıkları (Entities)
│   │       ├── repository/   # Veritabanı Erişim Katmanı
│   │       └── service/      # İş Mantığı ve Gemini API Katmanı
│   ├── exercises-data/       # Egzersiz Kütüphanesi (JSON formatında)
│   └── pom.xml               # Maven Bağımlılık Yönetimi
│
├── frontend/                 # React & Vite Frontend Projesi
│   ├── src/
│   │   ├── components/       # Tekrar Kullanılabilir UI Bileşenleri
│   │   ├── hooks/            # Özel React Hook'ları (useAiPoseCoach vb.)
│   │   ├── pages/            # Sayfa Bileşenleri (Dashboard, Diet, Coach vb.)
│   │   ├── store/            # Zustand Central Store (authStore vb.)
│   │   ├── App.jsx           # Ana Uygulama Bileşeni & Yönlendirmeler
│   │   └── main.jsx          # Giriş Noktası
│   └── package.json          # Bağımlılık Yönetimi (React 19, Recharts vb.)
```

---

## 🗄️ Veritabanı İlişki Şeması / *Database Schema*

PostgreSQL üzerinde `fitnessai` şeması altında koşan tablolarımız ve ilişkileri şu şekildedir:

*   **`users`**: Kullanıcı kayıt ve giriş bilgilerini (Rol ve BCrypt şifreli parola) saklar.
*   **`user_metrics`**: Kullanıcıya ait yaş, boy, kilo, cinsiyet, aktivite düzeyi, sakatlıklar ve hedefleri tutar.
*   **`workout_plans`**: Yapay zeka tarafından her kullanıcıya özel oluşturulmuş haftalık antrenman planlarını JSON formatında saklar.
*   **`diet_plans`**: Gemini tarafından üretilen diyet listelerini ve günlük kalori/makro hedeflerini saklar.
*   **`meal_logs`**: Kullanıcının tükettiği besinlerin kalori, protein, karbonhidrat, yağ ve mikrobesin (sodyum, potasyum, kafein vb.) değerlerini gün bazlı kaydeder.
*   **`progress_photos`**: Kullanıcının gelişim takibi amacıyla yüklediği fotoğrafları, güncel kilosunu ve aldığı notları saklar.

---

## 🔌 Temel API Endpoint Tanımları / *Core API Endpoints*

| Endpoint | Metot | Yetki | Açıklama / *Description* |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Yeni kullanıcı kaydı oluşturur. |
| `/api/auth/login` | `POST` | Public | Kullanıcı girişi ve JWT Token üretimi. |
| `/api/metrics` | `POST` | User | Biyometrik veri girişi / güncelleme. |
| `/api/ai/generate-workout` | `POST` | User | Kişiye özel antrenman programı oluşturur. |
| `/api/diet/generate-plan` | `POST` | User | Kişiselleştirilmiş diyet planı oluşturur. |
| `/api/ai/nutrition-analyze` | `POST` | User | Metin tabanlı besin analizi ve kalori hesaplaması yapar. |
| `/api/ai/nutrition-analyze-image`| `POST`| User | Yüklenen yemek fotoğrafını analiz ederek kalori tahmininde bulunur. |
| `/api/ai/coach` | `POST` | User | Yapay zeka spor koçu ile chat mesajlaşması. |
| `/api/exercises` | `GET` | User | Odaklanılan kas grubuna göre egzersizleri çeker. |

---

## 🛠️ Kurulum ve Çalıştırma / *Installation & Setup*

### 📋 Gereksinimler / *Prerequisites*
*   **Java 17 JDK** veya üzeri
*   **Maven**
*   **Node.js** (v18+)
*   **PostgreSQL** (Port: 5432)
*   **Google Gemini API Key** (Kendi anahtarınızı almanız gerekmektedir)

---

### 1. Backend Kurulumu / *Backend Setup*

1.  `backend/src/main/resources/application.properties` dosyasına gidin.
2.  PostgreSQL kullanıcı adı, şifre ve Gemini API anahtarınızı güncelleyin:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/postgres?currentSchema=fitnessai
    spring.datasource.username=postgres
    spring.datasource.password=YOUR_DB_PASSWORD
    
    gemini.api.key=YOUR_GEMINI_API_KEY
    ```
3.  Projenin ana dizininden projeyi derleyin ve çalıştırın:
    ```bash
    cd backend
    mvn clean install
    mvn spring-boot:run
    ```
4.  Backend ayağa kalktıktan sonra API dokümantasyonuna Swagger üzerinden erişebilirsiniz:
    

---

### 2. Frontend Kurulumu / *Frontend Setup*

1.  Gerekli paketleri yükleyin:
    ```bash
    cd frontend
    npm install
    ```
2.  Lokal ortam değişkenlerini tanımlayın. `frontend` klasörü altında `.env.local` dosyası oluşturun:
    ```env
    VITE_API_URL=http://localhost:8080
    ```
3.  Uygulamayı geliştirme modunda çalıştırın:
    ```bash
    npm run dev
    ```
4.  Uygulamaya tarayıcınızdan erişin:
    `http://localhost:5173`

---