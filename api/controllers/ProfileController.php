<?php
/**
 * Profile Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\ProfileService;

class ProfileController extends Controller {
    private $profileService;

    public function __construct() {
        $this->profileService = new ProfileService();
    }

    public function index() {
        $result = $this->profileService->getProfile();
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function update() {
        $data = $this->getJsonInput();
        $result = $this->profileService->updateProfile($data);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function changePassword() {
        $data = $this->getJsonInput();
        $result = $this->profileService->changePassword($data);
        $this->response($result['success'], $result['message'], null, $result['status']);
    }

    public function delete() {
        $data = $this->getJsonInput();
        $result = $this->profileService->deleteAccount($data['password'] ?? '');
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
