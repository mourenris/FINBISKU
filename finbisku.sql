-- FINBISKU Database Schema
-- Version 1.0 Final
-- Target: MySQL / MariaDB (phpMyAdmin compatible)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Database: `finbisku`
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `finbisku` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `finbisku`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `profile_usaha`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profile_usaha` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `nama_usaha` varchar(255) NOT NULL,
  `jenis_usaha` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `deskripsi_usaha` text NOT NULL,
  `tahun_berdiri` year(4) NOT NULL,
  `status_umkm` enum('Mikro','Kecil','Menengah') NOT NULL,
  `kontak_usaha` varchar(50) NOT NULL,
  `media_sosial` text DEFAULT NULL,
  `logo_usaha` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_business_name` (`user_id`,`nama_usaha`),
  KEY `idx_usaha_user_id` (`user_id`),
  CONSTRAINT `fk_usaha_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `transaksi`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transaksi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usaha_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jenis_transaksi` enum('Pemasukan','Pengeluaran') NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `nominal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_transaksi_usaha_date` (`usaha_id`,`tanggal`),
  KEY `idx_transaksi_jenis` (`jenis_transaksi`),
  CONSTRAINT `fk_transaksi_usaha` FOREIGN KEY (`usaha_id`) REFERENCES `profile_usaha` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `blog`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usaha_id` int(11) NOT NULL,
  `judul_blog` varchar(255) NOT NULL,
  `isi_blog` text NOT NULL,
  `gambar_blog` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_blog_usaha_id` (`usaha_id`),
  CONSTRAINT `fk_blog_usaha` FOREIGN KEY (`usaha_id`) REFERENCES `profile_usaha` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `artikel`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `artikel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul_artikel` varchar(255) NOT NULL,
  `thumbnail_artikel` varchar(255) NOT NULL,
  `isi_artikel` text NOT NULL,
  `kategori_artikel` enum('Perencanaan Keuangan','Permodalan & Investasi','Pemasaran & Digitalisasi','Legalitas & Perizinan','Pengembangan Produk') NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_artikel_kategori` (`kategori_artikel`),
  KEY `idx_artikel_created_at` (`created_at`),
  KEY `idx_artikel_author` (`created_by`),
  CONSTRAINT `fk_artikel_author` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `bookmark`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookmark` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `artikel_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_article` (`user_id`,`artikel_id`),
  KEY `idx_bookmark_user` (`user_id`),
  KEY `idx_bookmark_artikel` (`artikel_id`),
  CONSTRAINT `fk_bookmark_article` FOREIGN KEY (`artikel_id`) REFERENCES `artikel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
