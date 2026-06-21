<?php
/**
 * App Bootstrapper Class
 * FINBISKU
 */

namespace Core;

use Helpers\ResponseHelper;
use Helpers\SessionHelper;

class App {
    private $router;

    public function __construct(Router $router) {
        $this->router = $router;
        SessionHelper::start();
    }

    public function run() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['REQUEST_URI'];

        $route = $this->router->dispatch($method, $path);

        if ($route) {
            $this->handleRequest($route);
        } else {
            ResponseHelper::json(false, "Endpoint not found", null, 404);
        }
    }

    private function handleRequest($route) {
        $handler = $route['handler'];
        $params = $route['params'];
        $middlewares = $route['middleware'];

        // Execute Middlewares
        foreach ($middlewares as $middlewareClass) {
            $middleware = new $middlewareClass();
            $middleware->handle();
        }

        // Parse handler (Controller@Method)
        list($controllerName, $methodName) = explode('@', $handler);
        $fullControllerName = "\\Controllers\\" . $controllerName;

        if (class_exists($fullControllerName)) {
            $controller = new $fullControllerName();
            if (method_exists($controller, $methodName)) {
                call_user_func_array([$controller, $methodName], $params);
            } else {
                ResponseHelper::json(false, "Method $methodName not found in $controllerName", null, 500);
            }
        } else {
            ResponseHelper::json(false, "Controller $controllerName not found", null, 500);
        }
    }
}
