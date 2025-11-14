<?php
/**
 * Database Configuration and Connection Class
 * WampServer MySQL Configuration
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'mvn2';
    private $username = 'root';
    private $password = '757nfVdFK';
    private $charset = 'utf8mb4';
    private $collation = 'utf8mb4_0900_ai_ci';
    private $pdo;

    /**
     * Connect to database
     */
    public function connect() {
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=' . $this->charset;
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
            return $this->pdo;
        } catch (PDOException $e) {
            die('Database Connection Error: ' . $e->getMessage());
        }
    }

    /**
     * Get PDO instance
     */
    public function getPDO() {
        if (!$this->pdo) {
            $this->connect();
        }
        return $this->pdo;
    }
}
?>
