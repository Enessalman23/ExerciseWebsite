package controller;

import config.CurrentUser;
import entity.ProgressPhoto;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import repository.ProgressPhotoRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressPhotoController {

    private final ProgressPhotoRepository progressPhotoRepository;
    private final String UPLOAD_DIR = "uploads/progress-photos/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "weight", required = false, defaultValue = "0.0") double weight,
            @RequestParam(value = "note", required = false) String note,
            @CurrentUser User user) {

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filePath, file.getBytes());

            ProgressPhoto photo = ProgressPhoto.builder()
                    .user(user)
                    .photoUrl("/api/progress/images/" + filename)
                    .weightAtTime(weight)
                    .note(note)
                    .photoDate(LocalDate.now())
                    .build();

            progressPhotoRepository.save(photo);
            return ResponseEntity.ok(photo);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Dosya yüklenemedi: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ProgressPhoto>> getMyPhotos(@CurrentUser User user) {
        List<ProgressPhoto> photos = progressPhotoRepository.findByUserOrderByPhotoDateDesc(user);
        return ResponseEntity.ok(photos);
    }
    
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get(UPLOAD_DIR, filename);
            byte[] imageBytes = Files.readAllBytes(path);
            return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
