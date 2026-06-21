<?php
/**
 * Transaction Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\TransactionService;

class TransactionController extends Controller {
    private $transactionService;

    public function __construct() {
        $this->transactionService = new TransactionService();
    }

    public function index() {
        $result = $this->transactionService->getAllTransactions($_GET);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status'], null, $result['pagination'] ?? null);
    }

    public function show($id) {
        $result = $this->transactionService->getTransaction($id);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function store() {
        $data = $this->getJsonInput();
        $result = $this->transactionService->createTransaction($data);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function update($id) {
        $data = $this->getJsonInput();
        $result = $this->transactionService->updateTransaction($id, $data);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function delete($id) {
        $result = $this->transactionService->deleteTransaction($id);
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
