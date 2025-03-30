import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { 
  Home, 
  Package, 
  Menu as MenuIcon, 
  X, 
  LogOut,
  MessageSquare,
  FileText
} from 'lucide-react';

const SidebarNavItems: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <Home size={20} />, 
      path: '/dashboard', 
      current: location.pathname === '/dashboard',
    },
    { 
      name: 'Products', 
      icon: <Package size={20} />, 
      path: '/products', 
      current: location.pathname === '/products' || location.pathname.startsWith('/products/'),
    },
    { 
      name: 'Posts', 
      icon: <FileText size={20} />, 
      path: '/posts', 
      current: location.pathname === '/posts' || location.pathname.startsWith('/posts/'),
    },
    { 
      name: 'Comments', 
      icon: <MessageSquare size={20} />, 
      path: '/comments', 
      current: location.pathname === '/comments' || location.pathname.startsWith('/comments/'),
    },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
      
    }
  };

  return (
    <>
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2  bg-white shadow-lg hover:bg-gray-100 transition-all duration-200"
        aria-label="Toggle Menu"
      >
        <MenuIcon size={24} className="text-purple-600" />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMobileSidebar}
        />
      )}

      <div
        id="sidebar"
        className={`
          fixed left-0 top-0 h-screen w-[280px] z-50 lg:relative
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar
          collapsed={collapsed}
          backgroundColor="white"
          rootStyles={{
            border: '1px solid #e5e7eb',
            height: '100%',
          }}
          className="h-full"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              {!collapsed && (
                <h2 className="text-xl font-semibold text-purple-600">Dashboard</h2>
              )}
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2  hover:bg-purple-50 hidden lg:flex items-center justify-center transition-colors duration-200"
                  aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  {collapsed ? (
                    <MenuIcon size={20} className="text-purple-600" />
                  ) : (
                    <X size={20} className="text-purple-600" />
                  )}
                </button>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2  hover:bg-purple-50 lg:hidden transition-colors duration-200"
                  aria-label="Close Sidebar"
                >
                  <X size={20} className="text-purple-600" />
                </button>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1">
              <Menu
                menuItemStyles={{
                  button: {
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    icon={item.icon}
                    component={<Link to={item.path} />}
                    className={`
                      py-2 my-1 mx-2  transition-colors duration-200
                      ${
                        item.current
                          ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-500'
                          : 'text-gray-600 hover:bg-purple-50/50 hover:text-purple-600'
                      }
                    `}
                  >
                    <span className="font-medium">{item.name}</span>
                  </MenuItem>
                ))}
              </Menu>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200">
              <Menu
                menuItemStyles={{
                  button: {
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <MenuItem
                  icon={<LogOut size={20} className="text-red-500" />}
                  onClick={handleLogout}
                  className="m-2  text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <span className="font-medium">Logout</span>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarNavItems;
