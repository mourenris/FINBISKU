<?php
/**
 * Business Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class Business extends Model {
    protected $table = 'profile_usaha';

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getAllByUserId($userId) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function findByNameAndUserId($name, $userId) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE nama_usaha = ? AND user_id = ?");
        $stmt->execute([$name, $userId]);
        return $stmt->fetch();
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (user_id, nama_usaha, jenis_usaha, alamat, deskripsi_usaha, tahun_berdiri, status_umkm, kontak_usaha, media_sosial, logo_usaha) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['user_id'],
            $data['nama_usaha'],
            $data['jenis_usaha'],
            $data['alamat'],
            $data['deskripsi_usaha'],
            $data['tahun_berdiri'],
            $data['status_umkm'],
            $data['kontak_usaha'],
            $data['media_sosial'] ?? null,
            $data['logo_usaha'] ?? null
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

    public function countAll() {
        return $this->db->query("SELECT COUNT(*) FROM {$this->table}")->fetchColumn();
    }

    public function getRecent($limit = 5) {
        $stmt = $this->db->prepare("SELECT b.id, b.nama_usaha, b.jenis_usaha, b.created_at, u.nama as owner_name 
                                    FROM {$this->table} b 
                                    JOIN users u ON b.user_id = u.id 
                                    ORDER BY b.created_at DESC LIMIT ?");
        $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
