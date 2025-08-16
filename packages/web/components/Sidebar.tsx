'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ClipboardList, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/dashboard/assets',
      icon: Package,
      label: 'Assets',
    },
    {
      href: '/dashboard/tasks',
      icon: ClipboardList,
      label: 'Tasks',
    },
  ];

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-20 shadow-md px-4">
        <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-10 h-10 bg-indigo-500 rounded-full"></div>
          {isOpen && <h1 className="text-2xl font-bold text-gray-800 ml-3">Voli</h1>}
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              title={link.label}
              className={`flex items-center py-2 rounded-md hover:bg-gray-200 ${
                isActive ? 'bg-gray-200 font-semibold' : ''
              } ${isOpen ? 'px-4' : 'justify-center'}`}>
              <link.icon className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && <span className="text-gray-700">{link.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-4">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center justify-center w-full py-2 px-4 text-gray-700 rounded-md hover:bg-gray-200"
        >
          {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
