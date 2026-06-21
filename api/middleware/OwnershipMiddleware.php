<?php
/**
 * Ownership Middleware
 * FINBISKU
 */

namespace Middleware;

use Helpers\SessionHelper;
use Helpers\ResponseHelper;
use Core\Database;

class OwnershipMiddleware implements MiddlewareInterface {
    public function handle() {
        // Bypass entirely for public endpoints
        if (isset($_GET['public']) && $_GET['public'] == 'true') {
            return;
        }

        $userId = SessionHelper::get('user_id');
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove project subfolder from path
        $scriptName = dirname($_SERVER['SCRIPT_NAME']);
        if ($scriptName !== '/' && strpos($path, $scriptName) === 0) {
            $path = substr($path, strlen($scriptName));
        }

        $db = Database::getInstance()->getConnection();
        $usahaId = null;

        // 1. Resolve usaha_id from query context (for listing or creation)
        if (isset($_GET['usaha_id'])) {
            $usahaId = $_GET['usaha_id'];
        } else {
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input['usaha_id'])) {
                $usahaId = $input['usaha_id'];
            } elseif (isset($_POST['usaha_id'])) {
                $usahaId = $_POST['usaha_id'];
            }
        }

        // 2. Resolve ownership for specific resource types via URL parameters
        // Supported paths: /api/usaha/{id}, /api/transaksi/{id}, /api/blog/{id}, /api/bookmark/{id}
        if (preg_match('#^/(usaha|transaksi|blog|bookmark|bookmarks)/([0-9]+)#', $path, $matches)) {
            $resourceType = $matches[1];
            $resourceId = $matches[2];

            // Normalize resource type (support both bookmark and bookmarks)
            if ($resourceType === 'bookmarks') $resourceType = 'bookmark';

            if ($resourceType === 'usaha') {
                $stmt = $db->prepare("SELECT user_id FROM profile_usaha WHERE id = ?");
                $stmt->execute([$resourceId]);
                $resource = $stmt->fetch();
                
                if (!$resource) {
                    ResponseHelper::json(false, "Resource not found", null, 404);
                }
                if ($resource['user_id'] != $userId) {
                    ResponseHelper::json(false, "Forbidden: You do not own this business profile", null, 403);
                }
                return; // Validation passed for 'usaha'
            }

            if ($resourceType === 'transaksi' || $resourceType === 'blog') {
                $table = ($resourceType === 'transaksi') ? 'transaksi' : 'blog';
                $stmt = $db->prepare("SELECT usaha_id FROM $table WHERE id = ?");
                $stmt->execute([$resourceId]);
                $res = $stmt->fetch();
                
                if (!$res) {
                    ResponseHelper::json(false, "Resource not found", null, 404);
                }
                $usahaId = $res['usaha_id'];
            }

            if ($resourceType === 'bookmark') {
                $stmt = $db->prepare("SELECT user_id FROM bookmark WHERE id = ?");
                $stmt->execute([$resourceId]);
                $bookmark = $stmt->fetch();

                if (!$bookmark) {
                    ResponseHelper::json(false, "Resource not found", null, 404);
                }
                if ($bookmark['user_id'] != $userId) {
                    ResponseHelper::json(false, "Forbidden: You do not own this bookmark", null, 403);
                }
                return; // Validation passed for 'bookmark'
            }
        }

        // 3. Final ownership validation for business-owned resources (User -> Business)
        if ($usahaId) {
            $stmt = $db->prepare("SELECT user_id FROM profile_usaha WHERE id = ?");
            $stmt->execute([$usahaId]);
            $usaha = $stmt->fetch();

            if (!$usaha) {
                ResponseHelper::json(false, "Business profile not found", null, 404);
            }
            if ($usaha['user_id'] != $userId) {
                ResponseHelper::json(false, "Forbidden: You do not own this business profile", null, 403);
            }
        }
    }
}
