import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { Files } from "lucide-react";

type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  subItems?: NavSubItem[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <ListIcon />,
    name: "User List",
    path: "/users/all"
    ,
  },
  // {
  //   icon: <PageIcon />,
  //   name: "Add Articles",
  //   path: "/content/add"
  // },
  {
    icon: <ListIcon />,
    name: "Articles List",
    path: "/content/all"
  },
  // {
  //   icon: <PageIcon />,
  //   name: "Add Tags",
  //   path: "/content/tags/add"
  // },
  {
    icon: <ListIcon />,
    name: "Tags List",
    path: "/content/tags/list"
  },
//   {
//   icon: <PageIcon />,
//   name: "Add Rashi",
//   path: "/kundli/rashi/add"
// },
{
  icon: <ListIcon />,
  name: "Rashi List",
  path: "/kundli/rashi/list"
},
// {
//   icon: <PageIcon />,
//   name: "Add Planet",
//   path: "/kundli/planet/add"
// },
{
  icon: <ListIcon />,
  name: "Planet List",
  path: "/kundli/planet/list"
},

//   {
//   icon: <PageIcon />,
//   name: "Add Entrance Analysis",
//   path: "/vastu/entrance/analysis/add"
// },
{
  icon: <ListIcon />,
  name: "Entrance Analysis List",
  path: "/vastu/entrance/analysis/list"
},
{
  icon: <ListIcon />,
  name: "Entrance List",
  path: "/vastu/entrance/list"
},
// {
//   icon: <PageIcon />,
//   name: "Add Personality",
//   path: "/numerology/personality/add"
// },
{
  icon: <ListIcon />,
  name: "Personality List",
  path: "/numerology/personality/list"
},
// {
//   icon: <PageIcon />,
//   name: "Add Year Prediction",
//   path: "/numerology/year-prediction/add"
// },
{
  icon: <ListIcon />,
  name: "Year Prediction List",
  path: "/numerology/year-prediction/list"
},
// {
//   icon: <PageIcon />,
//   name: "Add Missing Number Remedy",
//   path: "/numerology/missing-number-remedies/add"
// },
{
  icon: <ListIcon />,
  name: "Missing Number Remedies List",
  path: "/numerology/missing-number-remedies/list"
},
// {
//   icon: <PageIcon />,
//   name: "Add Loshu Rajyog",
//   path: "/numerology/rajyogs/add"
// },
{
  icon: <ListIcon />,
  name: "Loshu Rajyogs List",
  path: "/numerology/rajyogs/list"
},
{
  icon: <ListIcon />,
  name: "Overview",
  path: "/analytics/user"
}

];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<string[]>([]);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Function to check if any subitem is active recursively
  const hasActiveSubItem = useCallback(
    (subItems: NavSubItem[]): boolean => {
      return subItems.some((subItem) => {
        if (isActive(subItem.path)) return true;
        if (subItem.subItems) return hasActiveSubItem(subItem.subItems);
        return false;
      });
    },
    [isActive]
  );

  // Auto-expand menus based on active route
  useEffect(() => {
    const activeMenus: string[] = [];

    const checkMenuItems = (items: NavItem[], prefix: string) => {
      items.forEach((nav, index) => {
        const menuKey = `${prefix}-${index}`;
        if (nav.subItems && hasActiveSubItem(nav.subItems)) {
          activeMenus.push(menuKey);

          // Check for nested submenus
          nav.subItems.forEach((subItem, subIndex) => {
            const subMenuKey = `${menuKey}-${subIndex}`;
            if (subItem.subItems && hasActiveSubItem(subItem.subItems)) {
              activeMenus.push(subMenuKey);
            }
          });
        }
      });
    };

    checkMenuItems(navItems, "main");

    setOpenSubmenu(activeMenus);
  }, [location, hasActiveSubItem]);

  // Update submenu heights when they open
  useEffect(() => {
    openSubmenu.forEach((key) => {
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubmenu]);

  const handleSubmenuToggle = (menuKey: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu.includes(menuKey)) {
        return prevOpenSubmenu.filter((key) => key !== menuKey);
      }
      return [...prevOpenSubmenu, menuKey];
    });
  };

  // Recursive function to render subitems
  const renderSubItems = (
    subItems: NavSubItem[],
    parentKey: string,
    level: number = 1
  ) => {
    return subItems.map((subItem, index) => {
      const subMenuKey = `${parentKey}-${index}`;
      const marginLeft = level === 1 ? "ml-9" : `ml-${9 + (level - 1) * 4}`;

      return (
        <li key={subItem.name}>
          {subItem.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(subMenuKey)}
                className={`menu-dropdown-item cursor-pointer w-full text-left ${
                  openSubmenu.includes(subMenuKey) ||
                  hasActiveSubItem(subItem.subItems || [])
                    ? "menu-dropdown-item-active"
                    : "menu-dropdown-item-inactive"
                }`}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{subItem.name}</span>
                  <span className="flex items-center gap-1">
                    {subItem.new && (
                      <span
                        className={`menu-dropdown-badge ${
                          openSubmenu.includes(subMenuKey) ||
                          hasActiveSubItem(subItem.subItems || [])
                            ? "menu-dropdown-badge-active"
                            : "menu-dropdown-badge-inactive"
                        }`}
                      >
                        new
                      </span>
                    )}
                    {subItem.pro && (
                      <span
                        className={`menu-dropdown-badge ${
                          openSubmenu.includes(subMenuKey) ||
                          hasActiveSubItem(subItem.subItems || [])
                            ? "menu-dropdown-badge-active"
                            : "menu-dropdown-badge-inactive"
                        }`}
                      >
                        pro
                      </span>
                    )}
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSubmenu.includes(subMenuKey) ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </span>
              </button>
              <div
                ref={(el) => {
                  subMenuRefs.current[subMenuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(subMenuKey)
                    ? `${subMenuHeight[subMenuKey]}px`
                    : "0px",
                }}
              >
                <ul className={`mt-2 space-y-1 ${marginLeft}`}>
                  {renderSubItems(subItem.subItems, subMenuKey, level + 1)}
                </ul>
              </div>
            </>
          ) : (
            <Link
              to={subItem.path}
              className={`menu-dropdown-item ${
                isActive(subItem.path)
                  ? "menu-dropdown-item-active"
                  : "menu-dropdown-item-inactive"
              }`}
            >
              {subItem.name}
              <span className="flex items-center gap-1 ml-auto">
                {subItem.new && (
                  <span
                    className={`menu-dropdown-badge ${
                      isActive(subItem.path)
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    }`}
                  >
                    new
                  </span>
                )}
                {subItem.pro && (
                  <span
                    className={`menu-dropdown-badge ${
                      isActive(subItem.path)
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    }`}
                  >
                    pro
                  </span>
                )}
              </span>
            </Link>
          )}
        </li>
      );
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const menuKey = `${menuType}-${index}`;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(menuKey)}
                className={`menu-item group ${
                  openSubmenu.includes(menuKey) ||
                  hasActiveSubItem(nav.subItems)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu.includes(menuKey) ||
                    hasActiveSubItem(nav.subItems)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu.includes(menuKey)
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[menuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(menuKey)
                    ? `${subMenuHeight[menuKey]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {renderSubItems(nav.subItems, menuKey)}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[300px]"
            : isHovered
            ? "w-[300px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
