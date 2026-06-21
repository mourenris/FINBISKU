import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  User,
  FileText, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SidebarItem from '../components/SidebarItem';
import Logo from '../components/Logo';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-brandBg flex font-body">
      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[220px] bg-[#0f3d2b] border-r border-[#1a5c38]/30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-[#1a5c38]/30">
            <Link to="/admin" className="flex items-center space-x-3 group" onClick={closeSidebar}>
              <Logo className="h-10 w-10 text-[#d4a830] transition-transform duration-200 group-hover:scale-105" />
              <span className="text-xl font-extrabold font-display text-white tracking-tight hover:text-[#d4a830] transition-colors">FINBISKU</span>
            </Link>
            <button className="md:hidden p-1 rounded-btn hover:bg-[#1a5c38]/40 text-[#6b8a78] hover:text-white" onClick={closeSidebar}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-2.5 py-4 space-y-1 flex-grow overflow-y-auto flex flex-col">
            <div className="pt-2 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Ringkasan</div>
            <SidebarItem to="/admin" end icon={LayoutDashboard} onClick={closeSidebar}>
              Dashboard
            </SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Manajemen</div>
            <SidebarItem to="/admin/articles" icon={FileText} onClick={closeSidebar}>
              Articles
            </SidebarItem>
            
            <SidebarItem to="/admin/users" icon={Users} onClick={closeSidebar}>
              Users
            </SidebarItem>
            
            <div className="pt-4 pb-2 px-2.5 text-[10px] font-semibold text-[#6b8a78] uppercase tracking-wider font-display">Pengaturan</div>
            <SidebarItem to="/admin/profile" icon={User} onClick={closeSidebar}>
              Profile
            </SidebarItem>
            
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
            <h2 className="text-lg font-bold font-display text-neutral-800 hidden md:block uppercase tracking-wider">Administrator Panel</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-neutral-900">{user?.nama}</span>
              <span className="text-xs text-neutral-500 capitalize">{user?.role}</span>
            </div>
            <Link to="/admin/profile" className="w-10 h-10 bg-neutral-100 rounded-full border border-neutral-200 overflow-hidden hover:opacity-85 transition-opacity">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'A')}&background=random`} 
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

export default AdminLayout;
