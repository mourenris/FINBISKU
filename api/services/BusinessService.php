<?php
/**
 * Business Service
 * FINBISKU
 */

namespace Services;

use Models\Business;
use Models\User;
use Helpers\SessionHelper;
use Helpers\UploadHelper;

class BusinessService {
    private $businessModel;
    private $userModel;
    private $uploadDir = BASE_PATH . '/uploads/logos/';

    public function __construct() {
        $this->businessModel = new Business();
        $this->userModel = new User();
    }

    public function getAllBusinesses() {
        $userId = SessionHelper::get('user_id');
        $data = $this->businessModel->getAllByUserId($userId);
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function getBusinessById($id) {
        $data = $this->businessModel->findById($id);
        if (!$data) return ['success' => false, 'message' => 'Bisnis tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function createBusiness($data, $file) {
        $userId = SessionHelper::get('user_id');

        if ($this->businessModel->findByNameAndUserId($data['nama_usaha'], $userId)) {
            return ['success' => false, 'message' => 'Nama usaha sudah terdaftar pada akun anda', 'status' => 400];
        }

        $logo = null;
        if ($file && $file['size'] > 0) {
            $logo = UploadHelper::upload($file, $this->uploadDir, 'logo');
            if ($logo === false) return ['success' => false, 'message' => 'Format logo tidak valid atau ukuran terlalu besar', 'status' => 400];
        }

        $data['user_id'] = $userId;
        $data['logo_usaha'] = $logo;

        $id = $this->businessModel->create($data);
        if ($id) return ['success' => true, 'message' => 'Bisnis berhasil dibuat', 'data' => ['id' => $id], 'status' => 201];
        
        if ($logo) UploadHelper::delete($logo, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal membuat bisnis', 'status' => 500];
    }

    public function updateBusiness($id, $data, $file) {
        $userId = SessionHelper::get('user_id');
        $current = $this->businessModel->findById($id);

        if ($data['nama_usaha'] !== $current['nama_usaha']) {
            if ($this->businessModel->findByNameAndUserId($data['nama_usaha'], $userId)) {
                return ['success' => false, 'message' => 'Nama usaha sudah digunakan', 'status' => 400];
            }
        }

        $newLogo = null;
        if ($file && $file['size'] > 0) {
            $newLogo = UploadHelper::upload($file, $this->uploadDir, 'logo');
            if ($newLogo === false) return ['success' => false, 'message' => 'Logo tidak valid', 'status' => 400];
            $data['logo_usaha'] = $newLogo;
        }

        if ($this->businessModel->update($id, $data)) {
            if ($newLogo && $current['logo_usaha']) UploadHelper::delete($current['logo_usaha'], $this->uploadDir);
            return ['success' => true, 'message' => 'Bisnis berhasil diperbarui', 'status' => 200];
        }

        if ($newLogo) UploadHelper::delete($newLogo, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal memperbarui bisnis', 'status' => 500];
    }

    public function deleteBusiness($id, $password) {
        $userId = SessionHelper::get('user_id');
        $user = $this->userModel->findByIdRaw($userId);

        if (!password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Password konfirmasi salah', 'status' => 400];
        }

        $current = $this->businessModel->findById($id);
        if ($this->businessModel->delete($id)) {
            if ($current['logo_usaha']) UploadHelper::delete($current['logo_usaha'], $this->uploadDir);
            return ['success' => true, 'message' => 'Bisnis berhasil dihapus', 'status' => 200];
        }

        return ['success' => false, 'message' => 'Gagal menghapus bisnis', 'status' => 500];
    }
}
