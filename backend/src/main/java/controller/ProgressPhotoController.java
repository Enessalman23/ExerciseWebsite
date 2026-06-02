package controller;

import config.CurrentUser;
import entity.ProgressPhoto;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import service.ProgressPhotoService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/progress-photos")
@RequiredArgsConstructor
public class ProgressPhotoController {

    private final ProgressPhotoService progressPhotoService;

    @PostMapping
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "weight", required = false, defaultValue = "0.0") double weight,
            @RequestParam(value = "note", required = false) String note,
            @RequestParam(value = "notes", required = false) String notes,
            @CurrentUser User user) {

        try {
            ProgressPhoto photo = progressPhotoService.uploadPhoto(file, weight, note, notes, user);
            return ResponseEntity.ok(photo);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Dosya yüklenemedi: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ProgressPhoto>> getMyPhotos(@CurrentUser User user) {
        return ResponseEntity.ok(progressPhotoService.getMyPhotos(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id, @CurrentUser User user) {
        boolean deleted = progressPhotoService.deletePhoto(id, user);
        if (deleted) {
            return ResponseEntity.ok("Fotoğraf başarıyla silindi.");
        } else {
            return ResponseEntity.status(404).body("Fotoğraf bulunamadı veya bu fotoğrafı silmeye yetkiniz yok.");
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = progressPhotoService.getImageBytes(filename);
            return ResponseEntity.ok().header("Content-Type", "image/jpeg").body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
