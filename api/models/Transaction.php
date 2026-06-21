<?php
/**
 * Transaction Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class Transaction extends Model {
    protected $table = 'transaksi';

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getAllByUsahaId($usahaId, $limit, $offset) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE usaha_id = ? ORDER BY tanggal DESC, created_at DESC LIMIT ? OFFSET ?");
        $stmt->bindValue(1, (int)$usahaId, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(3, (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (usaha_id, tanggal, jenis_transaksi, kategori, nominal, keterangan) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['usaha_id'],
            $data['tanggal'],
            $data['jenis_transaksi'],
            $data['kategori'],
            $data['nominal'],
            $data['keterangan'] ?? null
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

    public function countAllByUsahaId($usahaId) {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE usaha_id = ?");
        $stmt->execute([$usahaId]);
        return $stmt->fetchColumn();
    }

    public function sumIncomeByUsahaId($id) {
        $stmt = $this->db->prepare("SELECT SUM(nominal) FROM {$this->table} WHERE usaha_id = ? AND jenis_transaksi = 'Pemasukan'");
        $stmt->execute([$id]);
        return $stmt->fetchColumn() ?: 0;
    }

    public function sumExpenseByUsahaId($id) {
        $stmt = $this->db->prepare("SELECT SUM(nominal) FROM {$this->table} WHERE usaha_id = ? AND jenis_transaksi = 'Pengeluaran'");
        $stmt->execute([$id]);
        return $stmt->fetchColumn() ?: 0;
    }

    public function sumIncomeByUserId($userId) {
        $sql = "SELECT SUM(t.nominal) FROM {$this->table} t JOIN profile_usaha p ON t.usaha_id = p.id WHERE p.user_id = ? AND t.jenis_transaksi = 'Pemasukan'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchColumn() ?: 0;
    }

    public function sumExpenseByUserId($userId) {
        $sql = "SELECT SUM(t.nominal) FROM {$this->table} t JOIN profile_usaha p ON t.usaha_id = p.id WHERE p.user_id = ? AND t.jenis_transaksi = 'Pengeluaran'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchColumn() ?: 0;
    }

    public function getRecentByUsahaId($id, $limit) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE usaha_id = ? ORDER BY tanggal DESC, created_at DESC LIMIT ?");
        $stmt->bindValue(1, (int)$id, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getRecentByUserId($userId, $limit) {
        $sql = "SELECT t.*, p.nama_usaha FROM {$this->table} t JOIN profile_usaha p ON t.usaha_id = p.id WHERE p.user_id = ? ORDER BY t.tanggal DESC, t.created_at DESC LIMIT ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, (int)$userId, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getMonthlyIncomeExpenseByUsahaId($id) {
        $sql = "SELECT DATE_FORMAT(tanggal, '%Y-%m') as month, 
                SUM(CASE WHEN jenis_transaksi = 'Pemasukan' THEN nominal ELSE 0 END) as income,
                SUM(CASE WHEN jenis_transaksi = 'Pengeluaran' THEN nominal ELSE 0 END) as expense
                FROM {$this->table} 
                WHERE usaha_id = ? 
                GROUP BY month 
                ORDER BY month DESC 
                LIMIT 6";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return array_reverse($stmt->fetchAll());
    }

    public function getMonthlyIncomeExpenseByUserId($userId) {
        $sql = "SELECT DATE_FORMAT(t.tanggal, '%Y-%m') as month, 
                SUM(CASE WHEN t.jenis_transaksi = 'Pemasukan' THEN t.nominal ELSE 0 END) as income,
                SUM(CASE WHEN t.jenis_transaksi = 'Pengeluaran' THEN t.nominal ELSE 0 END) as expense
                FROM {$this->table} t 
                JOIN profile_usaha p ON t.usaha_id = p.id 
                WHERE p.user_id = ? 
                GROUP BY month 
                ORDER BY month DESC 
                LIMIT 6";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return array_reverse($stmt->fetchAll());
    }
}
