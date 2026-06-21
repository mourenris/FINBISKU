<?php
/**
 * Profile Service
 * FINBISKU
 */

namespace Services;

use Models\User;
use Helpers\SessionHelper;

class ProfileService {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function getProfile() {
        $userId = SessionHelper::get('user_id');
        $user = $this->userModel->findById($userId);
        if (!$user) {
            return ['success' => false, 'message' => 'User tidak ditemukan', 'status' => 404];
        }
        return ['success' => true, 'data' => $user, 'status' => 200];
    }

    public function updateProfile($data) {
        $userId = SessionHelper::get('user_id');
        
        if (empty($data['nama']) || empty($data['email'])) {
            return ['success' => false, 'message' => 'Nama dan Email harus diisi', 'status' => 400];
        }

        $existingUser = $this->userModel->findByEmail($data['email']);
        if ($existingUser && $existingUser['id'] != $userId) {
            return ['success' => false, 'message' => 'Email sudah digunakan oleh pengguna lain', 'status' => 400];
        }

        $updateData = [
            'nama' => $data['nama'],
            'email' => $data['email']
        ];

        if ($this->userModel->update($userId, $updateData)) {
            SessionHelper::set('nama', $data['nama']);
            return ['success' => true, 'message' => 'Profil berhasil diperbarui', 'status' => 200];
        }

        return ['success' => false, 'message' => 'Gagal memperbarui profil', 'status' => 500];
    }

    public function changePassword($data) {
        $userId = SessionHelper::get('user_id');
        $user = $this->userModel->findByIdRaw($userId); // Assuming Model has raw fetch for password

        if (!password_verify($data['old_password'], $user['password'])) {
            return ['success' => false, 'message' => 'Password lama salah', 'status' => 400];
        }

        if (strlen($data['new_password']) < 8 || !preg_match('/[A-Za-z]/', $data['new_password']) || !preg_match('/[0-9]/', $data['new_password'])) {
            return ['success' => false, 'message' => 'Password baru minimal 8 karakter (alphanumeric)', 'status' => 400];
        }

        $hashedPassword = password_hash($data['new_password'], PASSWORD_DEFAULT);
        if ($this->userModel->update($userId, ['password' => $hashedPassword])) {
            SessionHelper::regenerate(true);
            return ['success' => true, 'message' => 'Password berhasil diubah', 'status' => 200];
        }

        return ['success' => false, 'message' => 'Gagal mengubah password', 'status' => 500];
    }

    public function deleteAccount($password) {
        $userId = SessionHelper::get('user_id');
        $user = $this->userModel->findByIdRaw($userId);

        if (!password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Konfirmasi password salah', 'status' => 400];
        }

        if ($this->userModel->delete($userId)) {
            SessionHelper::destroy();
            return ['success' => true, 'message' => 'Akun berhasil dihapus', 'status' => 200];
        }

        return ['success' => false, 'message' => 'Gagal menghapus akun', 'status' => 500];
    }
}
