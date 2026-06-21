import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import Logo from '../components/Logo';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brandBg">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo className="h-10 w-10 text-[#d4a830] transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xl md:text-2xl font-extrabold font-display text-neutral-800 tracking-tight hover:text-[#d4a830] transition-colors">FINBISKU</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink 
              to="/" 
              className={({isActive}) => `text-sm font-semibold font-display px-4 py-2 rounded-btn transition-all ${isActive ? 'bg-finbisku-gold-100 text-finbisku-gold-600' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/articles" 
              className={({isActive}) => `text-sm font-semibold font-display px-4 py-2 rounded-btn transition-all ${isActive ? 'bg-finbisku-gold-100 text-finbisku-gold-600' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              Articles
            </NavLink>
            <NavLink 
              to="/public-blogs" 
              className={({isActive}) => `text-sm font-semibold font-display px-4 py-2 rounded-btn transition-all ${isActive ? 'bg-finbisku-gold-100 text-finbisku-gold-600' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              Blogs
            </NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-sm font-bold font-display text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-btn transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-finbisku-gold-400 text-white px-4 py-2 rounded-btn text-sm font-bold font-display hover:bg-finbisku-gold-500 hover:shadow-md transition-all">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 font-body">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group">
                <Logo className="h-10 w-10 text-[#d4a830] transition-transform duration-200 group-hover:scale-105" />
                <span className="text-xl md:text-2xl font-extrabold font-display text-neutral-800 tracking-tight hover:text-[#d4a830] transition-colors">FINBISKU</span>
              </Link>
              <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                Sistem Informasi Keuangan dan manajemen Bisnis untuk kemajuan UMKM Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold font-display text-neutral-850 mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link to="/" className="hover:text-finbisku-gold-500 transition-colors">Home</Link></li>
                <li><Link to="/articles" className="hover:text-finbisku-gold-500 transition-colors">Articles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-display text-neutral-850 mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link to="/login" className="hover:text-finbisku-gold-500 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-finbisku-gold-500 transition-colors">Register</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-450">
            &copy; {new Date().getFullYear()} FINBISKU. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
