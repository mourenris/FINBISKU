import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import ArticleListPage from '../pages/ArticleListPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

// User Pages
import DashboardPage from '../pages/DashboardPage';
import BusinessListPage from '../pages/BusinessListPage';
import BusinessCreatePage from '../pages/BusinessCreatePage';
import BusinessDetailPage from '../pages/BusinessDetailPage';
import BusinessEditPage from '../pages/BusinessEditPage';
import TransactionListPage from '../pages/TransactionListPage';
import TransactionCreatePage from '../pages/TransactionCreatePage';
import TransactionDetailPage from '../pages/TransactionDetailPage';
import TransactionEditPage from '../pages/TransactionEditPage';
import BlogListPage from '../pages/BlogListPage';
import BlogCreatePage from '../pages/BlogCreatePage';
import BlogDetailPage from '../pages/BlogDetailPage';
import BlogEditPage from '../pages/BlogEditPage';
import BookmarkListPage from '../pages/BookmarkListPage';
import ProfilePage from '../pages/ProfilePage';
import ChangePasswordPage from '../pages/ChangePasswordPage';

// Admin Pages
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UserListPage from '../pages/UserListPage';
import UserDetailPage from '../pages/UserDetailPage';
import AdminArticleListPage from '../pages/AdminArticleListPage';
import AdminArticleCreatePage from '../pages/AdminArticleCreatePage';
import AdminArticleEditPage from '../pages/AdminArticleEditPage';
import AdminProfilePage from '../pages/AdminProfilePage';
import PublicBlogListPage from '../pages/PublicBlogListPage';
import PublicBlogDetailPage from '../pages/PublicBlogDetailPage';

import { useAuth } from '../contexts/AuthContext';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout (Accessible to unauthenticated guests and users via header) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<ArticleListPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/public-blogs" element={<PublicBlogListPage />} />
        <Route path="/public-blogs/:id" element={<PublicBlogDetailPage />} />
      </Route>

      {/* Auth Routes without public layout */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* User Protected Routes */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserRoute><DashboardPage /></UserRoute>} />
        
        {/* In-Dashboard Article Views (Keeps user context clean without popping them out to public layers) */}
        <Route path="/dashboard/articles" element={<UserRoute><ArticleListPage /></UserRoute>} />
        <Route path="/dashboard/articles/:id" element={<UserRoute><ArticleDetailPage /></UserRoute>} />

        {/* Business */}
        <Route path="/business" element={<UserRoute><BusinessListPage /></UserRoute>} />
        <Route path="/business/add" element={<UserRoute><BusinessCreatePage /></UserRoute>} />
        <Route path="/business/:id" element={<UserRoute><BusinessDetailPage /></UserRoute>} />
        <Route path="/business/:id/edit" element={<UserRoute><BusinessEditPage /></UserRoute>} />
        
        {/* Transactions */}
        <Route path="/transactions" element={<UserRoute><TransactionListPage /></UserRoute>} />
        <Route path="/transactions/add" element={<UserRoute><TransactionCreatePage /></UserRoute>} />
        <Route path="/transactions/:id" element={<UserRoute><TransactionDetailPage /></UserRoute>} />
        <Route path="/transactions/:id/edit" element={<UserRoute><TransactionEditPage /></UserRoute>} />
        
        {/* Blogs */}
        <Route path="/blogs" element={<UserRoute><BlogListPage /></UserRoute>} />
        <Route path="/blogs/add" element={<UserRoute><BlogCreatePage /></UserRoute>} />
        <Route path="/blogs/:id" element={<UserRoute><BlogDetailPage /></UserRoute>} />
        <Route path="/blogs/:id/edit" element={<UserRoute><BlogEditPage /></UserRoute>} />
        
        {/* Others */}
        <Route path="/bookmarks" element={<UserRoute><BookmarkListPage /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
        <Route path="/profile/password" element={<UserRoute><ChangePasswordPage /></UserRoute>} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfilePage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
        <Route path="/admin/users/:id" element={<AdminRoute><UserDetailPage /></AdminRoute>} />
        <Route path="/admin/articles" element={<AdminRoute><AdminArticleListPage /></AdminRoute>} />
        <Route path="/admin/articles/add" element={<AdminRoute><AdminArticleCreatePage /></AdminRoute>} />
        <Route path="/admin/articles/:id" element={<AdminRoute><ArticleDetailPage /></AdminRoute>} />
        <Route path="/admin/articles/:id/edit" element={<AdminRoute><AdminArticleEditPage /></AdminRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold text-2xl">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
