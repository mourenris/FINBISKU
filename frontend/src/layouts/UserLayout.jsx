import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ArrowLeftRight, 
  Newspaper, 
  BookOpen, 
  Bookmark, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import SidebarItem from '../components/SidebarItem';
import Logo from '../components/Logo';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const { businesses, activeBusiness, changeActiveBusiness } = useBusiness();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-brandBg flex font-body">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[220px] bg-[#0f3d2b] border-r border-[#1a5c38]/30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-[#1a5c38]/30">
            <Link to="/dashboard" className="flex items-center space-x-3 group" onClick={closeSidebar}>
              <Logo className="h-10 w-10 text-[#d4a830] transition-transform duration-200 group-hover:scale-105" />
              <span className="text-xl font-extrabold font-display text-white tracking-tight hover:text-[#d4a830] transition-colors">FINBISKU</span>
            </Link>
            <button className="md:hidden p-1 rounded-btn hover:bg-[#1a5c38]/40 text-[#6b8a78] hover:text-white" onClick={closeSidebar}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-2.5 py-4 space-y-1 flex-grow overflow-y-auto">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} onClick={closeSidebar}>Dashboard</SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Usaha</div>
            <SidebarItem to="/business" icon={Briefcase} onClick={closeSidebar} badge={businesses.length}>Usaha Saya</SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Keuangan</div>
            <SidebarItem to="/transactions" icon={ArrowLeftRight} onClick={closeSidebar}>Keuangan</SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Edukasi & Cerita</div>
            <SidebarItem to="/dashboard/articles" icon={BookOpen} onClick={closeSidebar}>Pusat Belajar</SidebarItem>
            <SidebarItem to="/blogs" icon={Newspaper} onClick={closeSidebar}>Cerita UMKM</SidebarItem>
            <SidebarItem to="/bookmarks" icon={Bookmark} onClick={closeSidebar}>Bookmarks</SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Pengaturan</div>
            <SidebarItem to="/profile" icon={User} onClick={closeSidebar}>Profil Saya</SidebarItem>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-2.5 py-2 rounded-xl text-[#6b8a78] hover:bg-[#1a5c38]/30 hover:text-red-400 transition-all duration-250 mt-auto font-display font-semibold text-sm gap-2.5"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 rounded-btn hover:bg-neutral-100" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-neutral-500" />
            </button>
            
            {/* Business Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-btn transition-colors border border-neutral-200"
              >
                <div className="w-6 h-6 bg-finbisku-gold-100 text-finbisku-gold-600 flex items-center justify-center rounded-md font-bold text-[10px]">
                  {activeBusiness ? activeBusiness.nama_usaha.charAt(0) : 'B'}
                </div>
                <span className="text-sm font-semibold text-neutral-700 max-w-[150px] truncate">
                  {activeBusiness ? activeBusiness.nama_usaha : 'Pilih Bisnis'}
                </span>
                <ChevronDown className={`h-4 w-4 text-neutral-450 transition-transform ${isBusinessDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBusinessDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setIsBusinessDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-neutral-200 rounded-btn shadow-xl z-[70] p-2 animate-in fade-in zoom-in-95">
                    {businesses.length === 0 ? (
                      <div className="p-4 text-center text-sm text-neutral-500">Belum ada bisnis</div>
                    ) : (
                      businesses.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            changeActiveBusiness(b);
                            setIsBusinessDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-2 rounded-btn transition-colors ${activeBusiness?.id === b.id ? 'bg-finbisku-gold-50 text-finbisku-gold-600' : 'hover:bg-neutral-50 text-neutral-600'}`}
                        >
                          <div className={`w-8 h-8 flex items-center justify-center rounded-btn font-bold text-xs ${activeBusiness?.id === b.id ? 'bg-finbisku-gold-100 text-finbisku-gold-600' : 'bg-neutral-100 text-neutral-400'}`}>
                            {b.nama_usaha.charAt(0)}
                          </div>
                          <span className="font-medium text-sm text-left flex-grow truncate">{b.nama_usaha}</span>
                        </button>
                      ))
                    )}
                    <div className="border-t border-neutral-100 mt-2 pt-2 px-2">
                      <button 
                        onClick={() => {
                          navigate('/business');
                          setIsBusinessDropdownOpen(false);
                        }}
                        className="w-full text-center py-2 text-xs font-semibold text-finbisku-gold-600 hover:text-finbisku-gold-500"
                      >
                        Kelola Bisnis
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-neutral-900">{user?.nama}</span>
              <span className="text-xs text-neutral-500 capitalize">{user?.role}</span>
            </div>
            <Link to="/profile" className="w-10 h-10 bg-neutral-100 rounded-full border border-neutral-200 overflow-hidden hover:opacity-85 transition-opacity">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'U')}&background=random`} 
                alt="Avatar" 
              />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default UserLayout;
