<?php
/**
 * Bookmark Model
 * FINBISKU
 */

namespace Models;

use Core\Model;
use PDO;

class Bookmark extends Model {
    protected $table = 'bookmark';

    public function findByUserAndArticle($userId, $articleId) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ? AND artikel_id = ?");
        $stmt->execute([$userId, $articleId]);
        return $stmt->fetch();
    }

    public function getAllByUserId($userId, $limit, $offset) {
        $sql = "SELECT b.id as bookmark_id, a.* 
                FROM {$this->table} b 
                JOIN artikel a ON b.artikel_id = a.id 
                WHERE b.user_id = ? 
                ORDER BY b.created_at DESC 
                LIMIT ? OFFSET ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(1, (int)$userId, PDO::PARAM_INT);
        $stmt->bindValue(2, (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(3, (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($userId, $articleId) {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, artikel_id) VALUES (?, ?)");
        return $stmt->execute([$userId, $articleId]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
