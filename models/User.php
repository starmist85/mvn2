<?php
/**
 * User Model
 */

require_once __DIR__ . '/../config/Database.php';

class User {
    private $pdo;
    private $table = 'users';

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    /**
     * Get user by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Get user by openId
     */
    public function getByOpenId($openId) {
        $query = "SELECT * FROM {$this->table} WHERE openId = :openId";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':openId' => $openId]);
        return $stmt->fetch();
    }

    /**
     * Get all users
     */
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY createdAt DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Create or update user
     */
    public function upsert($data) {
        $openId = $data['openId'] ?? null;
        if (!$openId) {
            throw new Exception('openId is required');
        }

        $existingUser = $this->getByOpenId($openId);
        
        if ($existingUser) {
            // Update existing user
            $updateFields = [];
            $params = [':openId' => $openId];
            
            if (isset($data['name'])) {
                $updateFields[] = 'name = :name';
                $params[':name'] = $data['name'];
            }
            if (isset($data['email'])) {
                $updateFields[] = 'email = :email';
                $params[':email'] = $data['email'];
            }
            if (isset($data['loginMethod'])) {
                $updateFields[] = 'loginMethod = :loginMethod';
                $params[':loginMethod'] = $data['loginMethod'];
            }
            if (isset($data['role'])) {
                $updateFields[] = 'role = :role';
                $params[':role'] = $data['role'];
            }
            
            $updateFields[] = 'lastSignedIn = NOW()';
            
            $query = "UPDATE {$this->table} SET " . implode(', ', $updateFields) . " WHERE openId = :openId";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            
            return $this->getByOpenId($openId);
        } else {
            // Create new user
            $query = "INSERT INTO {$this->table} (openId, name, email, loginMethod, role, createdAt, lastSignedIn) 
                      VALUES (:openId, :name, :email, :loginMethod, :role, NOW(), NOW())";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':openId' => $openId,
                ':name' => $data['name'] ?? null,
                ':email' => $data['email'] ?? null,
                ':loginMethod' => $data['loginMethod'] ?? null,
                ':role' => $data['role'] ?? 'user'
            ]);
            
            return $this->getByOpenId($openId);
        }
    }

    /**
     * Delete user
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute([':id' => $id]);
    }
}
?>
