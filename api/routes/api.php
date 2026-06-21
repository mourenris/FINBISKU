<?php
/**
 * API Routes
 * FINBISKU - Financial and Business Information System for UMKM
 */

use Middleware\AuthMiddleware;
use Middleware\RoleMiddleware;
use Middleware\OwnershipMiddleware;

// ==================================================
// AUTHENTICATION ROUTES
// ==================================================
$router->add('POST', '/register', 'AuthController@register');
$router->add('POST', '/login', 'AuthController@login');
$router->add('POST', '/logout', 'AuthController@logout', [AuthMiddleware::class]);
$router->add('POST', '/forgot-password', 'AuthController@forgotPassword');

// ==================================================
// PROFILE ROUTES
// ==================================================
$router->add('GET', '/profile', 'ProfileController@index', [AuthMiddleware::class]);
$router->add('PUT', '/profile', 'ProfileController@update', [AuthMiddleware::class]);
$router->add('PUT', '/profile/password', 'ProfileController@changePassword', [AuthMiddleware::class]);
$router->add('DELETE', '/profile', 'ProfileController@delete', [AuthMiddleware::class]);

// ==================================================
// BUSINESS PROFILE (PROFILE USAHA) ROUTES
// ==================================================
$router->add('GET', '/usaha', 'BusinessController@index', [AuthMiddleware::class]);
$router->add('POST', '/usaha', 'BusinessController@store', [AuthMiddleware::class]);
$router->add('GET', '/usaha/{id}', 'BusinessController@show', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('POST', '/usaha/{id}', 'BusinessController@update', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('DELETE', '/usaha/{id}', 'BusinessController@delete', [AuthMiddleware::class, OwnershipMiddleware::class]);

// ==================================================
// TRANSACTION (TRANSAKSI) ROUTES
// ==================================================
$router->add('GET', '/transaksi', 'TransactionController@index', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('POST', '/transaksi', 'TransactionController@store', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('GET', '/transaksi/{id}', 'TransactionController@show', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('PUT', '/transaksi/{id}', 'TransactionController@update', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('DELETE', '/transaksi/{id}', 'TransactionController@delete', [AuthMiddleware::class, OwnershipMiddleware::class]);

// ==================================================
// BLOG ROUTES
// ==================================================
$router->add('GET', '/public-blogs', 'BlogController@publicIndex');
$router->add('GET', '/public-blogs/{id}', 'BlogController@publicShow');
$router->add('GET', '/blog', 'BlogController@index', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('POST', '/blog', 'BlogController@store', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('GET', '/blog/{id}', 'BlogController@show', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('POST', '/blog/{id}', 'BlogController@update', [AuthMiddleware::class, OwnershipMiddleware::class]);
$router->add('DELETE', '/blog/{id}', 'BlogController@delete', [AuthMiddleware::class, OwnershipMiddleware::class]);

// ==================================================
// ARTICLE (ARTIKEL) ROUTES
// ==================================================
$router->add('GET', '/artikel', 'ArticleController@index');
$router->add('GET', '/artikel/{id}', 'ArticleController@show');
$router->add('POST', '/artikel', 'ArticleController@store', [AuthMiddleware::class, RoleMiddleware::class]);
$router->add('POST', '/artikel/{id}', 'ArticleController@update', [AuthMiddleware::class, RoleMiddleware::class]);
$router->add('DELETE', '/artikel/{id}', 'ArticleController@delete', [AuthMiddleware::class, RoleMiddleware::class]);

// ==================================================
// BOOKMARK ROUTES
// ==================================================
$router->add('GET', '/bookmarks', 'BookmarkController@index', [AuthMiddleware::class]);
$router->add('POST', '/bookmarks', 'BookmarkController@store', [AuthMiddleware::class]);
$router->add('DELETE', '/bookmarks/{id}', 'BookmarkController@delete', [AuthMiddleware::class, OwnershipMiddleware::class]);

// ==================================================
// DASHBOARD ROUTES
// ==================================================
$router->add('GET', '/dashboard/user', 'DashboardController@user', [AuthMiddleware::class]);
$router->add('GET', '/dashboard/admin', 'DashboardController@admin', [AuthMiddleware::class, RoleMiddleware::class]);

// ==================================================
// ADMIN USER MANAGEMENT ROUTES
// ==================================================
$router->add('GET', '/admin/users', 'AdminUserController@index', [AuthMiddleware::class, RoleMiddleware::class]);
$router->add('GET', '/admin/users/{id}', 'AdminUserController@show', [AuthMiddleware::class, RoleMiddleware::class]);
$router->add('PATCH', '/admin/users/{id}/status', 'AdminUserController@updateStatus', [AuthMiddleware::class, RoleMiddleware::class]);
