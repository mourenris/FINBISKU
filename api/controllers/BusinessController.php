<?php
/**
 * Business Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\BusinessService;

class BusinessController extends Controller {
    private $businessService;

    public function __construct() {
        $this->businessService = new BusinessService();
    }

    public function index() {
        $result = $this->businessService->getAllBusinesses();
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function show($id) {
        $result = $this->businessService->getBusinessById($id);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function store() {
        $data = $_POST;
        $file = $_FILES['logo_usaha'] ?? null;
        $result = $this->businessService->createBusiness($data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function update($id) {
        $data = $_POST;
        $file = $_FILES['logo_usaha'] ?? null;
        $result = $this->businessService->updateBusiness($id, $data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function delete($id) {
        $data = $this->getJsonInput();
        $result = $this->businessService->deleteBusiness($id, $data['password'] ?? '');
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
