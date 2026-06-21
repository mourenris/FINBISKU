<?php
/**
 * Auth Service
 * FINBISKU
 */

namespace Services;

use Models\User;
use Helpers\SessionHelper;

class AuthService {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register($data) {
        if (empty($data['nama']) || empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'Semua field harus diisi', 'status' => 400];
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Format email tidak valid', 'status' => 400];
        }

        // 8 chars, alphanumeric check
        if (strlen($data['password']) < 8 || !preg_match('/[A-Za-z]/', $data['password']) || !preg_match('/[0-9]/', $data['password'])) {
            return ['success' => false, 'message' => 'Password minimal 8 karakter dan mengandung huruf serta angka', 'status' => 400];
        }

        if ($this->userModel->findByEmail($data['email'])) {
            return ['success' => false, 'message' => 'Email sudah terdaftar', 'status' => 400];
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        $data['role'] = 'user';
        $data['status'] = 'active';

        $userId = $this->userModel->create($data);
        if ($userId) {
            return ['success' => true, 'message' => 'Registrasi berhasil', 'status' => 201];
        }

        return ['success' => false, 'message' => 'Registrasi gagal', 'status' => 500];
    }

    public function login($email, $password) {
        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Email atau password salah', 'status' => 401];
        }

        if ($user['status'] !== 'active') {
            return ['success' => false, 'message' => 'Akun anda tidak aktif', 'status' => 403];
        }

        SessionHelper::regenerate(true);
        SessionHelper::set('user_id', $user['id']);
        SessionHelper::set('role', $user['role']);
        SessionHelper::set('nama', $user['nama']);

        unset($user['password']);
        return ['success' => true, 'message' => 'Login berhasil', 'data' => $user, 'status' => 200];
    }

    public function logout() {
        SessionHelper::destroy();
        return ['success' => true, 'message' => 'Logout berhasil', 'status' => 200];
    }

    public function forgotPassword($email) {
        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            return ['success' => false, 'message' => 'Email tidak ditemukan', 'status' => 404];
        }
        return ['success' => true, 'message' => 'Instruksi reset password dikirim', 'status' => 200];
    }
}
