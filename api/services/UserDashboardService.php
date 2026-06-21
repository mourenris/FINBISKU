<?php
/**
 * User Dashboard Service
 * FINBISKU
 */

namespace Services;

use Models\Transaction;
use Models\Business;
use Models\Article;
use Helpers\SessionHelper;

class UserDashboardService
{
    private $transactionModel;
    private $businessModel;
    private $articleModel;

    public function __construct()
    {
        $this->transactionModel = new Transaction();
        $this->businessModel = new Business();
        $this->articleModel = new Article();
    }

    public function getDashboardData($usahaId = null)
    {
        $userId = SessionHelper::get('user_id');

        if ($usahaId) {
            $business = $this->businessModel->findById($usahaId);
            if (!$business || $business['user_id'] != $userId) {
                return ['success' => false, 'message' => 'Akses ditolak: Anda tidak memiliki bisnis ini', 'status' => 403];
            }
            $pemasukan = $this->transactionModel->sumIncomeByUsahaId($usahaId);
            $pengeluaran = $this->transactionModel->sumExpenseByUsahaId($usahaId);
            $recent = $this->transactionModel->getRecentByUsahaId($usahaId, 5);
            $chart = $this->transactionModel->getMonthlyIncomeExpenseByUsahaId($usahaId);
        } else {
            $pemasukan = $this->transactionModel->sumIncomeByUserId($userId);
            $pengeluaran = $this->transactionModel->sumExpenseByUserId($userId);
            $recent = $this->transactionModel->getRecentByUserId($userId, 5);
            $chart = $this->transactionModel->getMonthlyIncomeExpenseByUserId($userId);
        }

        $latestArticles = $this->articleModel->getAll([], 3, 0);
        $totalUsaha = count($this->businessModel->getAllByUserId($userId));

        return [
            'success' => true,
            'data' => [
                'total_usaha' => $totalUsaha,
                'total_pemasukan' => (float) $pemasukan,
                'total_pengeluaran' => (float) $pengeluaran,
                'saldo' => (float) ($pemasukan - $pengeluaran),
                'chart' => $chart,
                'recent_transactions' => $recent,
                'latest_articles' => $latestArticles
            ],
            'status' => 200
        ];
    }
}
