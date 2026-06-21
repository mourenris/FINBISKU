<?php
/**
 * User Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class User extends Model {
    protected $table = 'users';

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT id, nama, email, role, status, created_at FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function findByIdRaw($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (nama, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nama'],
            $data['email'],
            $data['password'],
            $data['role'] ?? 'user',
            $data['status'] ?? 'active'
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
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($values);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getAllFiltered($filters, $limit, $offset) {
        $sql = "SELECT id, nama, email, role, status, created_at FROM {$this->table} WHERE role = 'user'";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (nama LIKE ? OR email LIKE ?)";
            $params[] = "%" . $filters['search'] . "%";
            $params[] = "%" . $filters['search'] . "%";
        }

        $sql .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        
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
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE role = 'user'";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (nama LIKE ? OR email LIKE ?)";
            $params[] = "%" . $filters['search'] . "%";
            $params[] = "%" . $filters['search'] . "%";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function getAll($limit, $offset) {
        $stmt = $this->db->prepare("SELECT id, nama, email, role, status, created_at FROM {$this->table} WHERE role = 'user' LIMIT ? OFFSET ?");
        $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countAll() {
        return $this->db->query("SELECT COUNT(*) FROM {$this->table} WHERE role = 'user'")->fetchColumn();
    }

    public function countByStatus($status) {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE role = 'user' AND status = ?");
        $stmt->execute([$status]);
        return $stmt->fetchColumn();
    }

    public function getMonthlyGrowth() {
        $sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') as label, COUNT(*) as count 
                FROM {$this->table} 
                WHERE role = 'user' 
                GROUP BY label 
                ORDER BY label ASC 
                LIMIT 12";
        return $this->db->query($sql)->fetchAll();
    }

    public function getWeeklyGrowth() {
        $sql = "SELECT DATE_FORMAT(created_at, '%Y-%u') as label, COUNT(*) as count 
                FROM {$this->table} 
                WHERE role = 'user' 
                GROUP BY label 
                ORDER BY label ASC 
                LIMIT 12";
        return $this->db->query($sql)->fetchAll();
    }

    public function getYearlyGrowth() {
        $sql = "SELECT DATE_FORMAT(created_at, '%Y') as label, COUNT(*) as count 
                FROM {$this->table} 
                WHERE role = 'user' 
                GROUP BY label 
                ORDER BY label ASC 
                LIMIT 10";
        return $this->db->query($sql)->fetchAll();
    }

    public function getRecent($limit = 5) {
        $stmt = $this->db->prepare("SELECT id, nama, email, status, created_at FROM {$this->table} WHERE role = 'user' ORDER BY created_at DESC LIMIT ?");
        $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
