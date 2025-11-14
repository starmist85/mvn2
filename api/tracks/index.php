<?php
/**
 * Tracks API Endpoints
 * GET /api/tracks/index.php - Get all tracks
 * GET /api/tracks/index.php?action=getByReleaseId&releaseId=1 - Get tracks by release ID
 * GET /api/tracks/index.php?action=getById&id=1 - Get track by ID
 * POST /api/tracks/index.php - Create track
 * PUT /api/tracks/index.php - Update track
 * DELETE /api/tracks/index.php - Delete track
 */

require_once __DIR__ . '/../../config/ApiResponse.php';
require_once __DIR__ . '/../../models/Track.php';

ApiResponse::handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

try {
    $track = new Track();

    if ($method === 'GET') {
        if ($action === 'getByReleaseId') {
            $releaseId = $_GET['releaseId'] ?? null;
            if (!$releaseId) {
                ApiResponse::error('releaseId parameter is required', 400);
            }
            $tracks = $track->getByReleaseId($releaseId);
            ApiResponse::success($tracks, 'Tracks retrieved successfully');
        } elseif ($action === 'getById') {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                ApiResponse::error('ID parameter is required', 400);
            }
            $trackData = $track->getById($id);
            if (!$trackData) {
                ApiResponse::error('Track not found', 404);
            }
            ApiResponse::success($trackData, 'Track retrieved successfully');
        } else {
            $tracks = $track->getAll();
            ApiResponse::success($tracks, 'All tracks retrieved successfully');
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($input['releaseId']) || !isset($input['trackNumber']) || !isset($input['artist']) || !isset($input['title']) || !isset($input['length'])) {
            ApiResponse::error('Missing required fields: releaseId, trackNumber, artist, title, length', 400);
        }

        $id = $track->create($input);
        ApiResponse::success(['id' => $id], 'Track created successfully', 201);
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for update', 400);
        }

        $id = $input['id'];
        unset($input['id']);
        
        $track->update($id, $input);
        ApiResponse::success(['id' => $id], 'Track updated successfully');
    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            ApiResponse::error('ID is required for delete', 400);
        }

        $track->delete($input['id']);
        ApiResponse::success(null, 'Track deleted successfully');
    } else {
        ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Error: ' . $e->getMessage(), 500);
}
?>
