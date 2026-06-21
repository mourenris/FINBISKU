<?php
/**
 * Blog Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\BlogService;

class BlogController extends Controller {
    private $blogService;

    public function __construct() {
        $this->blogService = new BlogService();
    }

    public function index() {
        $usahaId = $_GET['usaha_id'] ?? null;
        if (isset($_GET['public']) && $_GET['public'] == 'true') {
            $result = $this->blogService->getPublicBlogs();
        } else {
            $result = $this->blogService->getAllBlogs($usahaId);
        }
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function publicIndex() {
        $result = $this->blogService->getPublicBlogs();
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function show($id) {
        if (isset($_GET['public']) && $_GET['public'] == 'true') {
            $result = $this->blogService->getPublicBlog($id);
        } else {
            $result = $this->blogService->getBlog($id);
        }
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function publicShow($id) {
        $result = $this->blogService->getPublicBlog($id);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function store() {
        $data = $_POST;
        $file = $_FILES['gambar_blog'] ?? null;
        $result = $this->blogService->createBlog($data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function update($id) {
        $data = $_POST;
        $file = $_FILES['gambar_blog'] ?? null;
        $result = $this->blogService->updateBlog($id, $data, $file);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function delete($id) {
        $result = $this->blogService->deleteBlog($id);
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
