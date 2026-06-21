<?php
/**
 * Auth Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\AuthService;

class AuthController extends Controller {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function register() {
        $data = $this->getJsonInput();
        $result = $this->authService->register($data);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function login() {
        $data = $this->getJsonInput();
        $result = $this->authService->login($data['email'] ?? '', $data['password'] ?? '');
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function logout() {
        $result = $this->authService->logout();
        $this->response($result['success'], $result['message'], null, $result['status']);
    }

    public function forgotPassword() {
        $data = $this->getJsonInput();
        $result = $this->authService->forgotPassword($data['email'] ?? '');
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
