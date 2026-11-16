package com.recruitment.service;

import com.recruitment.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public FileStorageService(@Value("${app.file.upload-dir:uploads/resumes}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "cv.pdf");

        // Validate extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new AppException("Định dạng file không hợp lệ. Chỉ chấp nhận các định dạng: PDF, DOC, DOCX", HttpStatus.BAD_REQUEST);
        }

        // Validate size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException("Dung lượng file vượt quá giới hạn cho phép (tối đa 10MB)", HttpStatus.BAD_REQUEST);
        }

        try {
            String storedFileName = UUID.randomUUID() + "_" + originalFilename;
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/api/v1/files/download/" + storedFileName;
        } catch (IOException ex) {
            throw new AppException("Không thể lưu trữ file tải lên: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Path loadFileAsResource(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}

