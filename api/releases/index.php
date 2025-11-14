<?php
/**
 * Releases API Endpoints
 * GET /api/releases/index.php - Get all releases
 * GET /api/releases/index.php?action=latest&limit=5 - Get latest releases
 * GET /api/releases/index.php?action=getById&id=1 - Get release by ID
 * POST /api/releases/index.php - Create release
 * PUT /api/releases/index.php - Update release
 * DELETE /api/releases/index.php - Delete release
 */

require_once __DIR__ . '/../../config/ApiResponse.php';
require_once __DIR__ . '/../../models/Release.php';

ApiResponse::handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

try {
    $release = new Release();

    if ($method === 'GET') {
        if ($action === 'latest') {
            $limit = $_GET['limit'] ?? 5;
            $releases = $release->getLatest($limit);
            ApiResponse::success($releases, 'Latest releases retrieved successfully');
        } elseif ($action === 'getById') {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                ApiResponse::error('ID parameter is required', 400);
            }
            $releaseData = $release->getById($id);
            if (!$releaseData) {
                ApiResponse::error('Release not found', 404);
            }
            ApiResponse::success($releaseData, 'Release retrieved successfully');
        } else {
            $releases = $release->getAll();
            ApiResponse::success($releases, 'All releases retrieved successfully');
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($input['title']) || !isset($input['artist']) || !isset($input['releaseDate']) || !isset($input['format'])) {
            ApiResponse::error('Missing required fields: title, artist, releaseDate, format', 400);
        }

        $id = $release->create($input);
        ApiResponse::success(['id' => $id], 'Release created successfully', 201);
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for update', 400);
        }

        $id = $input['id'];
        unset($input['id']);
        
        $release->update($id, $input);
        ApiResponse::success(['id' => $id], 'Release updated successfully');
    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for delete', 400);
        }

        $release->delete($input['id']);
        ApiResponse::success(null, 'Release deleted successfully');
    } else {
        ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Error: ' . $e->getMessage(), 500);
}
?>
