<?php
/**
 * Dashboard Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\UserDashboardService;
use Services\AdminDashboardService;

class DashboardController extends Controller {
    private $userService;
    private $adminService;

    public function __construct() {
        $this->userService = new UserDashboardService();
        $this->adminService = new AdminDashboardService();
    }

    public function user() {
        $usahaId = $_GET['usaha_id'] ?? null;
        $result = $this->userService->getDashboardData($usahaId);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function admin() {
        $filter = $_GET['filter'] ?? 'monthly';
        $result = $this->adminService->getDashboardData($filter);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }
}
