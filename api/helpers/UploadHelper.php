<?php
/**
 * Upload Helper Class
 * FINBISKU
 */

namespace Helpers;

class UploadHelper {
    public static function upload($file, $targetDir, $prefix = 'file') {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        // Validate MIME type
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!in_array($mimeType, $allowedMimes)) {
            return false;
        }

        // Validate size (2MB)
        if ($file['size'] > 2 * 1024 * 1024) {
            return false;
        }

        // Generate randomized filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $prefix . '_' . bin2hex(random_bytes(16)) . '_' . time() . '.' . $extension;
        $targetPath = $targetDir . $filename;

        // Ensure directory exists
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return $filename;
        }

        return false;
    }

    public static function delete($filename, $targetDir) {
        $filePath = $targetDir . $filename;
        if (!empty($filename) && file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }
}
