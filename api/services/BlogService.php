<?php
/**
 * Blog Service
 * FINBISKU
 */

namespace Services;

use Models\Blog;
use Helpers\UploadHelper;
use Helpers\SessionHelper;

class BlogService {
    private $blogModel;
    private $uploadDir = BASE_PATH . '/uploads/blogs/';

    public function __construct() {
        $this->blogModel = new Blog();
    }

    public function getAllBlogs($usahaId) {
        if (!$usahaId) return ['success' => false, 'message' => 'Usaha ID diperlukan', 'status' => 400];
        $data = $this->blogModel->getAllByUsahaId($usahaId);
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function getPublicBlogs() {
        $data = $this->blogModel->getPublicBlogs();
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function getPublicBlog($id) {
        $data = $this->blogModel->findPublicById($id);
        if (!$data) return ['success' => false, 'message' => 'Blog tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function getBlog($id) {
        $data = $this->blogModel->findById($id);
        if (!$data) return ['success' => false, 'message' => 'Blog tidak ditemukan', 'status' => 404];
        return ['success' => true, 'data' => $data, 'status' => 200];
    }

    public function createBlog($data, $file) {
        if (strlen($data['isi_blog']) < 10) {
            return ['success' => false, 'message' => 'Isi blog minimal 10 karakter', 'status' => 400];
        }

        $image = null;
        if ($file && $file['size'] > 0) {
            $image = UploadHelper::upload($file, $this->uploadDir, 'blog');
            if ($image === false) return ['success' => false, 'message' => 'Gambar tidak valid', 'status' => 400];
        }

        $data['gambar_blog'] = $image;
        $id = $this->blogModel->create($data);
        if ($id) return ['success' => true, 'message' => 'Blog berhasil dipublikasikan', 'data' => ['id' => $id], 'status' => 201];
        
        if ($image) UploadHelper::delete($image, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal membuat blog', 'status' => 500];
    }

    public function updateBlog($id, $data, $file) {
        $current = $this->blogModel->findById($id);
        
        $newImage = null;
        if ($file && $file['size'] > 0) {
            $newImage = UploadHelper::upload($file, $this->uploadDir, 'blog');
            if ($newImage === false) return ['success' => false, 'message' => 'Gambar tidak valid', 'status' => 400];
            $data['gambar_blog'] = $newImage;
        }

        if ($this->blogModel->update($id, $data)) {
            if ($newImage && $current['gambar_blog']) UploadHelper::delete($current['gambar_blog'], $this->uploadDir);
            return ['success' => true, 'message' => 'Blog berhasil diperbarui', 'status' => 200];
        }

        if ($newImage) UploadHelper::delete($newImage, $this->uploadDir);
        return ['success' => false, 'message' => 'Gagal memperbarui blog', 'status' => 500];
    }

    public function deleteBlog($id) {
        $current = $this->blogModel->findById($id);
        if ($this->blogModel->delete($id)) {
            if ($current['gambar_blog']) UploadHelper::delete($current['gambar_blog'], $this->uploadDir);
            return ['success' => true, 'message' => 'Blog berhasil dihapus', 'status' => 200];
        }
        return ['success' => false, 'message' => 'Gagal menghapus blog', 'status' => 500];
    }
}
