<?php
/**
 * Base Controller Class
 * FINBISKU
 */

namespace Core;

use Helpers\ResponseHelper;

abstract class Controller {
    protected function getJsonInput() {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    protected function response($success, $message, $data = null, $statusCode = 200, $errors = null, $pagination = null) {
        ResponseHelper::json($success, $message, $data, $statusCode, $errors, $pagination);
    }
}
