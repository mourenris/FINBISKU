import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, children, onClick, end, activeClassName, inactiveClassName, badge }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-sm font-medium transition-all duration-150 group font-display
        ${isActive 
          ? (activeClassName || 'bg-[#1a5c38] text-[#d4a830] border-l-[3px] border-[#d4a830] pl-2 font-semibold') 
          : (inactiveClassName || 'text-[#6b8a78] hover:bg-[#1a5c38]/30 hover:text-white')}
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0 transition-colors" />
      <span className="flex-grow text-left">{children}</span>
      {badge !== undefined && badge !== null && (
        <span className="bg-[#d4a830] text-[#0f3d2b] text-[10px] font-bold rounded-full px-1.5 py-0.5 font-sans">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;
