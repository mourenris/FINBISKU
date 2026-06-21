<?php
/**
 * Bookmark Controller
 * FINBISKU
 */

namespace Controllers;

use Core\Controller;
use Services\BookmarkService;

class BookmarkController extends Controller {
    private $bookmarkService;

    public function __construct() {
        $this->bookmarkService = new BookmarkService();
    }

    public function index() {
        $result = $this->bookmarkService->getBookmarks($_GET);
        $this->response($result['success'], $result['message'] ?? '', $result['data'] ?? null, $result['status']);
    }

    public function store() {
        $data = $this->getJsonInput();
        $result = $this->bookmarkService->addBookmark($data['artikel_id'] ?? null);
        $this->response($result['success'], $result['message'], $result['data'] ?? null, $result['status']);
    }

    public function delete($id) {
        $result = $this->bookmarkService->removeBookmark($id);
        $this->response($result['success'], $result['message'], null, $result['status']);
    }
}
