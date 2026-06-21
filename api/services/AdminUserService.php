<?php
/**
 * Admin User Service
 * FINBISKU
 */

namespace Services;

use Models\User;
use Helpers\SessionHelper;

class AdminUserService {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function getUsers($params) {
        $page = $params['page'] ?? 1;
        $limit = $params['limit'] ?? 10;
        $offset = ($page - 1) * $limit;

        $filters = [
            'search' => $params['search'] ?? null,
            'status' => $params['status'] ?? null
        ];

        $data = $this->userModel->getAllFiltered($filters, $limit, $offset);
        $total = $this->userModel->countFiltered($filters);

        return [
            'success' => true,
            'data' => $data,
            'total' => (int)$total,
            'status' => 200
        ];
    }

    public function getUserDetail($id) {
        $data = $this->userModel->findById($id);
        if (!$data) return ['success' => false, 'message' => 'User tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function updateStatus($id, $status) {
        $adminId = SessionHelper::get('user_id');
        
        if ($id == $adminId) {
            return ['success' => false, 'message' => 'Anda tidak dapat menonaktifkan akun sendiri', 'status' => 400];
        }

        if (!in_array($status, ['active', 'inactive'])) {
            return ['success' => false, 'message' => 'Status tidak valid', 'status' => 400];
        }

        if ($this->userModel->update($id, ['status' => $status])) {
            return ['success' => true, 'message' => 'Status user berhasil diperbarui', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal memperbarui status user', 'status' => 500];
    }
}
