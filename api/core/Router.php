<?php
/**
 * Router Class
 * FINBISKU
 */

namespace Core;

class Router {
    protected $routes = [];

    public function add($method, $path, $handler, $middleware = []) {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware
        ];
    }

    public function dispatch($requestedMethod, $requestedPath) {
        $requestedPath = parse_url($requestedPath, PHP_URL_PATH);
        
        // Remove project subfolder from path if exists
        $scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        if ($scriptName !== '/' && strpos($requestedPath, $scriptName) === 0) {
            $requestedPath = substr($requestedPath, strlen($scriptName));
        }

        // Ensure path starts with / and is not empty
        if (empty($requestedPath)) {
            $requestedPath = '/';
        }
        if ($requestedPath[0] !== '/') {
            $requestedPath = '/' . $requestedPath;
        }

        foreach ($this->routes as $route) {
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[a-zA-Z0-9_-]+)', $route['path']);
            $pattern = "#^" . $pattern . "$#";

            if ($route['method'] === $requestedMethod && preg_match($pattern, $requestedPath, $matches)) {
                // Filter matches to get only named parameters
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                return [
                    'handler' => $route['handler'],
                    'params' => $params,
                    'middleware' => $route['middleware']
                ];
            }
        }

        return null;
    }
}
