<?php
/**
 * News API Endpoints
 * GET /api/news/index.php - Get all news articles
 * GET /api/news/index.php?action=latest&limit=5 - Get latest news articles
 * GET /api/news/index.php?action=getById&id=1 - Get news article by ID
 * POST /api/news/index.php - Create news article
 * PUT /api/news/index.php - Update news article
 * DELETE /api/news/index.php - Delete news article
 */

require_once __DIR__ . '/../../config/ApiResponse.php';
require_once __DIR__ . '/../../models/News.php';

ApiResponse::handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

try {
    $news = new News();

    if ($method === 'GET') {
        if ($action === 'latest') {
            $limit = $_GET['limit'] ?? 5;
            $articles = $news->getLatest($limit);
            ApiResponse::success($articles, 'Latest news articles retrieved successfully');
        } elseif ($action === 'getById') {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                ApiResponse::error('ID parameter is required', 400);
            }
            $article = $news->getById($id);
            if (!$article) {
                ApiResponse::error('News article not found', 404);
            }
            ApiResponse::success($article, 'News article retrieved successfully');
        } else {
            $articles = $news->getAll();
            ApiResponse::success($articles, 'All news articles retrieved successfully');
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($input['title']) || !isset($input['excerpt']) || !isset($input['content']) || !isset($input['publishDate'])) {
            ApiResponse::error('Missing required fields: title, excerpt, content, publishDate', 400);
        }

        $id = $news->create($input);
        ApiResponse::success(['id' => $id], 'News article created successfully', 201);
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for update', 400);
        }

        $id = $input['id'];
        unset($input['id']);
        
        $news->update($id, $input);
        ApiResponse::success(['id' => $id], 'News article updated successfully');
    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for delete', 400);
        }

        $news->delete($input['id']);
        ApiResponse::success(null, 'News article deleted successfully');
    } else {
        ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Error: ' . $e->getMessage(), 500);
}
?>
