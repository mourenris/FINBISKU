<?php
/**
 * Bookmark Service
 * FINBISKU
 */

namespace Services;

use Models\Bookmark;
use Models\Article;
use Helpers\SessionHelper;

class BookmarkService {
    private $bookmarkModel;
    private $articleModel;

    public function __construct() {
        $this->bookmarkModel = new Bookmark();
        $this->articleModel = new Article();
    }

    public function getBookmarks($params) {
        $userId = SessionHelper::get('user_id');
        $page = $params['page'] ?? 1;
        $limit = $params['limit'] ?? 10;
        $offset = ($page - 1) * $limit;

        $data = $this->bookmarkModel->getAllByUserId($userId, $limit, $offset);
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function addBookmark($articleId) {
        $userId = SessionHelper::get('user_id');

        if (!$this->articleModel->findById($articleId)) {
            return ['success' => false, 'message' => 'Artikel tidak ditemukan', 'status' => 404];
        }

        if ($this->bookmarkModel->findByUserAndArticle($userId, $articleId)) {
            return ['success' => false, 'message' => 'Artikel sudah ditandai', 'status' => 400];
        }

        if ($this->bookmarkModel->create($userId, $articleId)) {
            return ['success' => true, 'message' => 'Artikel berhasil disimpan', 'status' => 201];
        }
        return ['success' => false, 'message' => 'Gagal menyimpan bookmark', 'status' => 500];
    }

    public function removeBookmark($id) {
        if ($this->bookmarkModel->delete($id)) {
            return ['success' => true, 'message' => 'Bookmark berhasil dihapus', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal menghapus bookmark', 'status' => 500];
    }
}
