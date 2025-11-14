<?php
/**
 * Track Model
 */

require_once __DIR__ . '/../config/Database.php';

class Track {
    private $pdo;
    private $table = 'tracks';

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    /**
     * Get all tracks
     */
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY releaseId, trackNumber ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get tracks by release ID
     */
    public function getByReleaseId($releaseId) {
        $query = "SELECT * FROM {$this->table} WHERE releaseId = :releaseId ORDER BY trackNumber ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':releaseId' => $releaseId]);
        return $stmt->fetchAll();
    }

    /**
     * Get track by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Create track
     */
    public function create($data) {
        $query = "INSERT INTO {$this->table} (releaseId, trackNumber, artist, title, length, createdAt) 
                  VALUES (:releaseId, :trackNumber, :artist, :title, :length, NOW())";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':releaseId' => $data['releaseId'],
            ':trackNumber' => $data['trackNumber'],
            ':artist' => $data['artist'],
            ':title' => $data['title'],
            ':length' => $data['length']
        ]);
        
        return $this->pdo->lastInsertId();
    }

    /**
     * Update track
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
     * Delete track
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Delete tracks by release ID
     */
    public function deleteByReleaseId($releaseId) {
        $query = "DELETE FROM {$this->table} WHERE releaseId = :releaseId";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':releaseId' => $releaseId]);
    }
}
?>
