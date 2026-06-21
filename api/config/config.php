<?php
/**
 * Configuration File
 * FINBISKU - Financial and Business Information System for UMKM
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'finbisku');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application Configuration
define('APP_URL', 'http://localhost/FINBISKU');
define('BASE_PATH', dirname(__DIR__));

// Session Configuration
define('SESSION_LIFETIME', 86400); // 24 hours

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
