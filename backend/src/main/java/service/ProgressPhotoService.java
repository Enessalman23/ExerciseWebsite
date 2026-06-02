package service;

import entity.ProgressPhoto;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import repository.ProgressPhotoRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressPhotoService {

    private final ProgressPhotoRepository progressPhotoRepository;
    private final String UPLOAD_DIR = "uploads/progress-photos/";

    @Transactional
    public ProgressPhoto uploadPhoto(MultipartFile file, double weight, String note, String notes, User user) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, filename);
        Files.write(filePath, file.getBytes());

        String finalNote = notes != null ? notes : note;

        ProgressPhoto photo = ProgressPhoto.builder()
                .user(user)
                .photoUrl("/api/progress-photos/images/" + filename)
                .weightAtTime(weight)
                .note(finalNote)
                .photoDate(LocalDate.now())
                .build();

        return progressPhotoRepository.save(photo);
    }

    @Transactional(readOnly = true)
    public List<ProgressPhoto> getMyPhotos(User user) {
        return progressPhotoRepository.findByUserOrderByIdDesc(user);
    }

    @Transactional
    public boolean deletePhoto(Long id, User user) {
        Optional<ProgressPhoto> photoOpt = progressPhotoRepository.findById(id);
        if (photoOpt.isPresent()) {
            ProgressPhoto photo = photoOpt.get();
            if (photo.getUser().getId().equals(user.getId())) {
                try {
                    String photoUrl = photo.getPhotoUrl();
                    String filename = photoUrl.substring(photoUrl.lastIndexOf("/") + 1);
                    Path filePath = Paths.get(UPLOAD_DIR, filename);
                    Files.deleteIfExists(filePath);
                } catch (Exception e) {
                    System.err.println("Dosya silinirken hata oluştu: " + e.getMessage());
                }
                progressPhotoRepository.delete(photo);
                return true;
            }
        }
        return false;
    }

    public byte[] getImageBytes(String filename) throws IOException {
        Path path = Paths.get(UPLOAD_DIR, filename);
        return Files.readAllBytes(path);
    }
}
