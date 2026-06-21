<?php
/**
 * Transaction Service
 * FINBISKU
 */

namespace Services;

use Models\Transaction;
use Models\Business;
use Helpers\SessionHelper;

class TransactionService {
    private $transactionModel;
    private $businessModel;

    public function __construct() {
        $this->transactionModel = new Transaction();
        $this->businessModel = new Business();
    }

    public function getAllTransactions($params) {
        $usahaId = $params['usaha_id'] ?? null;
        if (!$usahaId) return ['success' => false, 'message' => 'Usaha ID diperlukan', 'status' => 400];

        $page = $params['page'] ?? 1;
        $limit = $params['limit'] ?? 10;
        $offset = ($page - 1) * $limit;

        $data = $this->transactionModel->getAllByUsahaId($usahaId, $limit, $offset);
        $total = $this->transactionModel->countAllByUsahaId($usahaId);
        return [
            'success' => true,
            'data' => $data,
            'pagination' => [
                'total' => (int)$total,
                'page' => (int)$page,
                'limit' => (int)$limit
            ],
            'status' => 200
        ];
    }

    public function getTransaction($id) {
        $data = $this->transactionModel->findById($id);
        if (!$data) return ['success' => false, 'message' => 'Transaksi tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function createTransaction($data) {
        if ($data['tanggal'] > date('Y-m-d')) {
            return ['success' => false, 'message' => 'Tanggal tidak boleh melebihi hari ini', 'status' => 400];
        }

        if (!in_array($data['jenis_transaksi'], ['Pemasukan', 'Pengeluaran'])) {
            return ['success' => false, 'message' => 'Jenis transaksi tidak valid', 'status' => 400];
        }

        if ($data['nominal'] <= 0) {
            return ['success' => false, 'message' => 'Nominal harus lebih dari 0', 'status' => 400];
        }

        $id = $this->transactionModel->create($data);
        if ($id) return ['success' => true, 'message' => 'Transaksi berhasil dicatat', 'data' => ['id' => $id], 'status' => 201];
        return ['success' => false, 'message' => 'Gagal mencatat transaksi', 'status' => 500];
    }

    public function updateTransaction($id, $data) {
        if (isset($data['tanggal']) && $data['tanggal'] > date('Y-m-d')) {
            return ['success' => false, 'message' => 'Tanggal tidak valid', 'status' => 400];
        }

        if ($this->transactionModel->update($id, $data)) {
            return ['success' => true, 'message' => 'Transaksi berhasil diperbarui', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal memperbarui transaksi', 'status' => 500];
    }

    public function deleteTransaction($id) {
        if ($this->transactionModel->delete($id)) {
            return ['success' => true, 'message' => 'Transaksi berhasil dihapus', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal menghapus transaksi', 'status' => 500];
    }
}
