<?php
/**
 * Admin User Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\AdminUserService;

class AdminUserController extends Controller {
    private $adminUserService;

    public function __construct() {
        $this->adminUserService = new AdminUserService();
    }

    public function index() {
        $result = $this->adminUserService->getUsers($_GET);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function show($id) {
        $result = $this->adminUserService->getUserDetail($id);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function updateStatus($id) {
        $data = $this->getJsonInput();
        $result = $this->adminUserService->updateStatus($id, $data['status'] ?? '');
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
