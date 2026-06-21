<?php
/**
 * Response Helper Class
 * FINBISKU
 */

namespace Helpers;

class ResponseHelper {
    public static function json($success, $message, $data = null, $statusCode = 200, $errors = null, $pagination = null) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        $response = [
            'success' => $success,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        if ($pagination !== null) {
            $response['pagination'] = $pagination;
        }

        echo json_encode($response);
        exit;
    }
}
