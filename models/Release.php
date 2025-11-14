<?php
/**
 * Release Model
 */

require_once __DIR__ . '/../config/Database.php';

class Release {
    private $pdo;
    private $table = 'releases';

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    /**
     * Get all releases
     */
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY releaseDate DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get latest releases
     */
    public function getLatest($limit = 5) {
        $query = "SELECT * FROM {$this->table} ORDER BY releaseDate DESC LIMIT :limit";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get release by ID with tracks
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        $release = $stmt->fetch();
        
        if ($release) {
            // Get tracks for this release
            $trackQuery = "SELECT * FROM tracks WHERE releaseId = :releaseId ORDER BY trackNumber ASC";
            $trackStmt = $this->pdo->prepare($trackQuery);
            $trackStmt->execute([':releaseId' => $id]);
            $release['tracks'] = $trackStmt->fetchAll();
        }
        
        return $release;
    }

    /**
     * Create release
     */
    public function create($data) {
        $query = "INSERT INTO {$this->table} (title, artist, releaseDate, description, format, imageUrl, audioPreviewUrl, youtubeLink, spotifyLink, appleMusicLink, storeLink, createdAt) 
                  VALUES (:title, :artist, :releaseDate, :description, :format, :imageUrl, :audioPreviewUrl, :youtubeLink, :spotifyLink, :appleMusicLink, :storeLink, NOW())";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':title' => $data['title'],
            ':artist' => $data['artist'],
            ':releaseDate' => $data['releaseDate'],
            ':description' => $data['description'] ?? null,
            ':format' => $data['format'],
            ':imageUrl' => $data['imageUrl'] ?? null,
            ':audioPreviewUrl' => $data['audioPreviewUrl'] ?? null,
            ':youtubeLink' => $data['youtubeLink'] ?? null,
            ':spotifyLink' => $data['spotifyLink'] ?? null,
            ':appleMusicLink' => $data['appleMusicLink'] ?? null,
            ':storeLink' => $data['storeLink'] ?? null
        ]);
        
        return $this->pdo->lastInsertId();
    }

    /**
     * Update release
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
     * Delete release
     */
    public function delete($id) {
        // Delete associated tracks first
        $trackQuery = "DELETE FROM tracks WHERE releaseId = :id";
        $trackStmt = $this->pdo->prepare($trackQuery);
        $trackStmt->execute([':id' => $id]);
        
        // Delete release
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':id' => $id]);
    }
}
?>
