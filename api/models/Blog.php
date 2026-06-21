<?php
/**
 * Blog Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class Blog extends Model {
    protected $table = 'blog';

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getAllByUsahaId($usahaId) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE usaha_id = ? ORDER BY created_at DESC");
        $stmt->execute([$usahaId]);
        return $stmt->fetchAll();
    }

    public function getPublicBlogs() {
        $sql = "SELECT b.*, pu.nama_usaha, pu.jenis_usaha as kategori_usaha 
                FROM {$this->table} b 
                JOIN profile_usaha pu ON b.usaha_id = pu.id 
                ORDER BY b.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function findPublicById($id) {
        $sql = "SELECT b.*, pu.nama_usaha, pu.jenis_usaha as kategori_usaha 
                FROM {$this->table} b 
                JOIN profile_usaha pu ON b.usaha_id = pu.id 
                WHERE b.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (usaha_id, judul_blog, isi_blog, gambar_blog) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['usaha_id'],
            $data['judul_blog'],
            $data['isi_blog'],
            $data['gambar_blog'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $fields = [];
        $values = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }
        $values[] = $id;
        $sql = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = ?";
        return $this->db->prepare($sql)->execute($values);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getRecent($limit = 5) {
        $sql = "SELECT b.id, b.judul_blog, b.created_at, pu.nama_usaha 
                FROM {$this->table} b 
                JOIN profile_usaha pu ON b.usaha_id = pu.id 
                ORDER BY b.created_at DESC LIMIT ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
