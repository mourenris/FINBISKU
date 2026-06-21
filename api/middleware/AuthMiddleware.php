<?php
/**
 * Auth Middleware
 * FINBISKU
 */

namespace Middleware;

use Helpers\SessionHelper;
use Helpers\ResponseHelper;

class AuthMiddleware implements MiddlewareInterface {
    public function handle() {
        if (!SessionHelper::has('user_id')) {
            ResponseHelper::json(false, "Unauthorized access", null, 401);
        }
    }
}
