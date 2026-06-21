<?php
/**
 * Article Service
 * FINBISKU
 */

namespace Services;

use Models\Article;
use Helpers\UploadHelper;
use Helpers\SessionHelper;

class ArticleService {
    private $articleModel;
    private $uploadDir = BASE_PATH . '/uploads/articles/';
    private $allowedCategories = [
        'Perencanaan Keuangan',
        'Permodalan & Investasi',
        'Pemasaran & Digitalisasi',
        'Legalitas & Perizinan',
        'Pengembangan Produk'
    ];

    public function __construct() {
        $this->articleModel = new Article();
    }

    public function getAllArticles($params) {
        $page = $params['page'] ?? 1;
        $limit = $params['limit'] ?? 10;
        $offset = ($page - 1) * $limit;
        
        $filters = [
            'kategori' => $params['kategori'] ?? null,
            'search' => $params['search'] ?? null
        ];

        $data = $this->articleModel->getAll($filters, $limit, $offset);
        $total = $this->articleModel->countFiltered($filters);

        return [
            'success' => true,
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => (int)$page,
                'limit' => (int)$limit
            ],
            'status' => 200
        ];
    }

    public function getArticle($id) {
        $data = $this->articleModel->findById($id);
        if (!$data) return ['success' => false, 'message' => 'Artikel tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function createArticle($data, $file) {
        if (!in_array($data['kategori_artikel'], $this->allowedCategories)) {
            return ['success' => false, 'message' => 'Kategori tidak valid', 'status' => 400];
        }

        if (strlen($data['isi_artikel']) < 50) {
            return ['success' => false, 'message' => 'Isi artikel minimal 50 karakter', 'status' => 400];
        }

        $thumbnail = UploadHelper::upload($file, $this->uploadDir, 'article');
        if (!$thumbnail) return ['success' => false, 'message' => 'Thumbnail wajib dan harus valid', 'status' => 400];

        $data['thumbnail_artikel'] = $thumbnail;
        $data['created_by'] = SessionHelper::get('user_id');

        $id = $this->articleModel->create($data);
        if ($id) return ['success' => true, 'message' => 'Artikel berhasil dibuat', 'data' => ['id' => $id], 'status' => 201];
        
        UploadHelper::delete($thumbnail, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal membuat artikel', 'status' => 500];
    }

    public function updateArticle($id, $data, $file) {
        $current = $this->articleModel->findById($id);

        if (isset($data['kategori_artikel']) && !in_array($data['kategori_artikel'], $this->allowedCategories)) {
            return ['success' => false, 'message' => 'Kategori tidak valid', 'status' => 400];
        }

        $newThumb = null;
        if ($file && $file['size'] > 0) {
            $newThumb = UploadHelper::upload($file, $this->uploadDir, 'article');
            if ($newThumb === false) return ['success' => false, 'message' => 'Thumbnail tidak valid', 'status' => 400];
            $data['thumbnail_artikel'] = $newThumb;
        }

        if ($this->articleModel->update($id, $data)) {
            if ($newThumb && $current['thumbnail_artikel']) UploadHelper::delete($current['thumbnail_artikel'], $this->uploadDir);
            return ['success' => true, 'message' => 'Artikel berhasil diperbarui', 'status' => 200];
        }

        if ($newThumb) UploadHelper::delete($newThumb, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal memperbarui artikel', 'status' => 500];
    }

    public function deleteArticle($id) {
        $current = $this->articleModel->findById($id);
        if ($this->articleModel->delete($id)) {
            if ($current['thumbnail_artikel']) UploadHelper::delete($current['thumbnail_artikel'], $this->uploadDir);
            return ['success' => true, 'message' => 'Artikel berhasil dihapus', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal menghapus artikel', 'status' => 500];
    }
}
