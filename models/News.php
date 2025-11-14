<?php
/**
 * News Model
 */

require_once __DIR__ . '/../config/Database.php';

class News {
    private $pdo;
    private $table = 'news';

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    /**
     * Get all news articles
     */
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY publishDate DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get latest news articles
     */
    public function getLatest($limit = 5) {
        $query = "SELECT * FROM {$this->table} ORDER BY publishDate DESC LIMIT :limit";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get news article by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Create news article
     */
    public function create($data) {
        $query = "INSERT INTO {$this->table} (title, excerpt, content, imageUrl, publishDate, createdAt) 
                  VALUES (:title, :excerpt, :content, :imageUrl, :publishDate, NOW())";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':title' => $data['title'],
            ':excerpt' => $data['excerpt'],
            ':content' => $data['content'],
            ':imageUrl' => $data['imageUrl'] ?? null,
            ':publishDate' => $data['publishDate']
        ]);
        
        return $this->pdo->lastInsertId();
    }

    /**
     * Update news article
     */
    public function update($id, $data) {
        $updateFields = [];
        $params = [':id' => $id];
        
        foreach ($data as $key => $value) {
            $updateFields[] = "$key = :$key";
            $params[":$key"] = $value;
        }
        
        $query = "UPDATE {$this->table} SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($params);
    }

    /**
     * Delete news article
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':id' => $id]);
    }
}
?>
