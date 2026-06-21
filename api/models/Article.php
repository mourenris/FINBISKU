<?php
/**
 * Article Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class Article extends Model {
    protected $table = 'artikel';

    public function findById($id) {
        $sql = "SELECT a.*, u.nama as author_name 
                FROM {$this->table} a 
                JOIN users u ON a.created_by = u.id 
                WHERE a.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getAll($filters, $limit, $offset) {
        $sql = "SELECT a.*, u.nama as author_name 
                FROM {$this->table} a 
                JOIN users u ON a.created_by = u.id 
                WHERE 1=1";
        $params = [];

        if (!empty($filters['kategori'])) {
            $sql .= " AND a.kategori_artikel = ?";
            $params[] = $filters['kategori'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (a.judul_artikel LIKE ? OR a.isi_artikel LIKE ?)";
            $params[] = "%" . $filters['search'] . "%";
            $params[] = "%" . $filters['search'] . "%";
        }

        $sql .= " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
        
        $stmt = $this->db->prepare($sql);
        foreach ($params as $i => $val) {
            $stmt->bindValue($i + 1, $val);
        }
        $stmt->bindValue(count($params) + 1, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(count($params) + 2, (int)$offset, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countFiltered($filters) {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE 1=1";
        $params = [];

        if (!empty($filters['kategori'])) {
            $sql .= " AND kategori_artikel = ?";
            $params[] = $filters['kategori'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (judul_artikel LIKE ? OR isi_artikel LIKE ?)";
            $params[] = "%" . $filters['search'] . "%";
            $params[] = "%" . $filters['search'] . "%";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (judul_artikel, thumbnail_artikel, isi_artikel, kategori_artikel, created_by) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['judul_artikel'],
            $data['thumbnail_artikel'],
            $data['isi_artikel'],
            $data['kategori_artikel'],
            $data['created_by']
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
}
