<?php
/**
 * Admin Dashboard Service
 * FINBISKU
 */

namespace Services;

use Models\User;
use Models\Business;
use Models\Article;

class AdminDashboardService {
    private $userModel;
    private $businessModel;
    private $articleModel;
    private $blogModel;

    public function __construct() {
        $this->userModel = new \Models\User();
        $this->businessModel = new \Models\Business();
        $this->articleModel = new \Models\Article();
        $this->blogModel = new \Models\Blog();
    }

    public function getDashboardData($filter = 'monthly') {
        $totalUsers = $this->userModel->countAll();
        $activeUsers = $this->userModel->countByStatus('active');
        $inactiveUsers = $this->userModel->countByStatus('inactive');
        $totalBusinesses = $this->businessModel->countAll();
        $totalArticles = $this->articleModel->countFiltered([]);
        
        // Growth chart data based on filter
        switch ($filter) {
            case 'weekly':
                $growth = $this->userModel->getWeeklyGrowth();
                break;
            case 'yearly':
                $growth = $this->userModel->getYearlyGrowth();
                break;
            case 'monthly':
            default:
                $growth = $this->userModel->getMonthlyGrowth();
                break;
        }

        // Additional widgets
        $recentUsers = $this->userModel->getRecent(5);
        $recentBusinesses = $this->businessModel->getRecent(5);
        $recentBlogs = $this->blogModel->getRecent(5);

        return [
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'total_businesses' => $totalBusinesses,
                'total_articles' => $totalArticles,
                'user_growth_chart' => $growth,
                'recent_registrations' => $recentUsers,
                'recent_businesses' => $recentBusinesses,
                'recent_blogs' => $recentBlogs,
            ],
            'status' => 200
        ];
    }
}
