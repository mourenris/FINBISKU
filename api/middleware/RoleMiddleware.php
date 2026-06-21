<?php
/**
 * Role Middleware
 * FINBISKU
 */

namespace Middleware;

use Helpers\SessionHelper;
use Helpers\ResponseHelper;

class RoleMiddleware implements MiddlewareInterface {
    private $allowedRoles;

    public function __construct(array $allowedRoles = ['admin']) {
        $this->allowedRoles = $allowedRoles;
    }

    public function handle() {
        $userRole = SessionHelper::get('role');
        
        if (!in_array($userRole, $this->allowedRoles)) {
            ResponseHelper::json(false, "Forbidden: Access denied for your role", null, 403);
        }
    }
}
