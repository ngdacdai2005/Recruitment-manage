package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "Tải lên và tải xuống file CV, tài liệu ứng tuyển")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải lên file CV (PDF, DOC, DOCX - Tối đa 10MB)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadResumeFile(@RequestParam("file") MultipartFile file) {
        String downloadUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.ok("Tải file CV thành công", Map.of(
                "fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "cv.pdf",
                "fileUrl", downloadUrl
        )));
    }

    @GetMapping("/download/{fileName:.+}")
    @Operation(summary = "Tải xuống hoặc xem file CV đã lưu")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.loadFileAsResource(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}

