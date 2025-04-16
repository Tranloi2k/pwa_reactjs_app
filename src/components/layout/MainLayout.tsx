import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { debounce } from "lodash";

interface NavigationItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigation: NavigationGroup[] = [
    {
      title: "Tổng quan",
      items: [
        {
          name: "Dashboard",
          path: "/",
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
      ],
    },
    {
      title: "Management",
      items: [
        // {
        //   name: "Users",
        //   path: "/users",
        //   icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        //   badge: "3",
        // },
        {
          name: "Products",
          path: "/products",
          icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        },
        {
          name: "Orders",
          path: "/orders",
          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          name: "Settings",
          path: "/settings",
          icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        },
        {
          name: "Support",
          path: "/support",
          icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
        },
      ],
    },
  ];

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split("/").filter((i) => i);
    return paths.map((path, index) => {
      const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
      return {
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: fullPath,
      };
    });
  }, [location.pathname]);

  const checkScreenSize = useCallback(
    debounce(() => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setIsSidebarCollapsed(false);
      }
    }, 300),
    []
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    if (!isSidebarCollapsed) {
      setSidebarOpen(true);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const logout = () => {
    console.log("Logout");
    setShowUserDropdown(false);
  };

  useEffect(() => {
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [checkScreenSize]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay (only shown on mobile) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0 ${isSidebarCollapsed ? "w-24" : "w-64"}`}
      >
        <div className="flex items-center justify-between h-18 px-6 py-4 border-b border-gray-300">
          {isSidebarCollapsed ? (
            <div className="flex w-full items-center justify-center">
              <button
                onClick={toggleSidebarCollapse}
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/"
                className="text-xl font-semibold text-gray-800 flex items-center"
              >
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="pl-2">MyApp</span>
              </Link>
              <button
                onClick={toggleSidebarCollapse}
                className="p-1 rounded-lg hover:bg-gray-100 hidden lg:block"
                title={isSidebarCollapsed ? "Mở rộng" : "Thu nhỏ"}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="px-4 py-6">
          {/* User Profile */}
          {!isSidebarCollapsed && (
            <div className="flex items-center px-3 py-4 rounded-lg bg-gray-50 mb-6">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User avatar"
              />
              <div className="ml-3 pl-3">
                <p className="text-sm font-medium text-gray-900">
                  Sarah Johnson
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav>
            {navigation.map((group, index) => (
              <div key={index} className="mb-6 last:mb-0">
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                    {group.title}
                  </h3>
                )}
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-3 rounded-lg mb-1 hover:bg-gray-100 transition-colors ${
                          location.pathname === item.path
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700"
                        } ${isSidebarCollapsed ? "justify-center" : ""}`}
                        title={isSidebarCollapsed ? item.name : ""}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={item.icon}
                          />
                        </svg>
                        {!isSidebarCollapsed && (
                          <>
                            <span className="ml-3 px-1">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white border-gray-300">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 h-18">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-600 focus:outline-none lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Breadcrumbs */}
              <nav className="flex ml-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index}>
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <Link
                          to={crumb.path}
                          className={`ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2 ${
                            index === breadcrumbs.length - 1
                              ? "text-indigo-600"
                              : ""
                          }`}
                        >
                          {crumb.name}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Header Right */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  placeholder="Tìm kiếm..."
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User avatar"
                  />
                  <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                    Sarah J.
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Cài đặt
                    </Link>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
