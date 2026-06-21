<?php
/**
 * Session Helper Class
 * FINBISKU
 */

namespace Helpers;

class SessionHelper {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            // Set secure session cookie parameters
            session_set_cookie_params([
                'lifetime' => SESSION_LIFETIME,
                'path' => '/',
                'domain' => '',
                'secure' => isset($_SERVER['HTTPS']),
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            session_start();
        }
    }

    public static function regenerate($deleteOldSession = true) {
        self::start();
        return session_regenerate_id($deleteOldSession);
    }

    public static function set($key, $value) {
        self::start();
        $_SESSION[$key] = $value;
    }

    public static function get($key) {
        self::start();
        return $_SESSION[$key] ?? null;
    }

    public static function destroy() {
        self::start();
        
        // 1. Clear session memory
        $_SESSION = [];

        // 2. Expire session cookie on client side
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        // 3. Destroy session on server side
        session_destroy();
    }

    public static function has($key) {
        self::start();
        return isset($_SESSION[$key]);
    }
}
