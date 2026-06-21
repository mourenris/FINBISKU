<?php
/**
 * Article Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\ArticleService;

class ArticleController extends Controller {
    private $articleService;

    public function __construct() {
        $this->articleService = new ArticleService();
    }

    public function index() {
        $result = $this->articleService->getAllArticles($_GET);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status'], null, $result['pagination'] ?? null);
    }

    public function show($id) {
        $result = $this->articleService->getArticle($id);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function store() {
        $data = $_POST;
        $file = $_FILES['thumbnail_artikel'] ?? null;
        $result = $this->articleService->createArticle($data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function update($id) {
        $data = $_POST;
        $file = $_FILES['thumbnail_artikel'] ?? null;
        $result = $this->articleService->updateArticle($id, $data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function delete($id) {
        $result = $this->articleService->deleteArticle($id);
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
