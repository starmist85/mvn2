<?php
/**
 * File Upload API Endpoint
 * POST /api/upload/index.php - Upload file
 */

require_once __DIR__ . '/../../config/ApiResponse.php';

ApiResponse::handleCors();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method !== 'POST') {
        ApiResponse::error('Method not allowed', 405);
    }

    // Check if file was uploaded
    if (!isset($_FILES['file'])) {
        ApiResponse::error('No file uploaded', 400);
    }

    $file = $_FILES['file'];
    $type = $_POST['type'] ?? 'general'; // 'image' or 'audio'

    // Validate file
    $maxSizeImage = 5 * 1024 * 1024; // 5MB for images
    $maxSizeAudio = 50 * 1024 * 1024; // 50MB for audio
    
    $maxSize = ($type === 'audio') ? $maxSizeAudio : $maxSizeImage;
    
    if ($file['size'] > $maxSize) {
        ApiResponse::error('File size exceeds maximum limit', 400);
    }

    // Validate file type
    $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
    
    $allowedTypes = ($type === 'audio') ? $allowedAudioTypes : $allowedImageTypes;
    
    if (!in_array($file['type'], $allowedTypes)) {
        ApiResponse::error('Invalid file type', 400);
    }

    // Create upload directory if it doesn't exist
    $uploadDir = __DIR__ . '/../../uploads/' . $type . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename
    $filename = uniqid() . '_' . basename($file['name']);
    $filepath = $uploadDir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        ApiResponse::error('Failed to upload file', 500);
    }

    // Return file URL
    $fileUrl = '/uploads/' . $type . '/' . $filename;
    
    ApiResponse::success([
        'url' => $fileUrl,
        'filename' => $filename,
        'type' => $type
    ], 'File uploaded successfully', 201);

} catch (Exception $e) {
    ApiResponse::error('Error: ' . $e->getMessage(), 500);
}
?>
