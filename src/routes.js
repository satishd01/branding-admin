// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Banner from "layouts/tables/banners";
import Hosts from "layouts/tables/user";
import Festival from "layouts/tables/festival";
import BusinessCardCategory from "layouts/tables/BusinessCardCategory";
import PostCategories from "layouts/tables/PostCategories";
import Employees from "layouts/tables/employee";

// @mui icons
import Icon from "@mui/material/Icon";

// Get user role and permissions from localStorage
const getUserRole = () => localStorage.getItem("role");
const getPermissions = () => {
  try {
    const raw = localStorage.getItem("permissions");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Base routes like sign-in
const baseRoutes = [
  {
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

// All application routes (can assign permission keys)
const allRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/users",
    component: <Hosts />,
    permission: "user_management",
  },
  {
    type: "collapse",
    name: "Banners",
    key: "banners",
    icon: <Icon fontSize="small">collections</Icon>,
    route: "/banners",
    component: <Banner />,
    permission: "banner_management",
  },
  {
    type: "collapse",
    name: "Festival",
    key: "festival",
    icon: <Icon fontSize="small">celebration</Icon>,
    route: "/festival",
    component: <Festival />,
    permission: "festival_management",
  },
  {
    type: "collapse",
    name: "Business Card Category",
    key: "business-card-category",
    icon: <Icon fontSize="small">contact_mail</Icon>,
    route: "/business-card-category",
    component: <BusinessCardCategory />,
    permission: "card_category",
  },
  {
    type: "collapse",
    name: "Post Categories",
    key: "post-categories",
    icon: <Icon fontSize="small">bookmark</Icon>,
    route: "/post-categories",
    component: <PostCategories />,
    permission: "post_category",
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/employees",
    component: <Employees />,
    permission: "employee_management",
  },
];

// Final filtering logic
const getFilteredRoutes = () => {
  const role = getUserRole();
  const permissions = getPermissions();

  // If admin → return all routes
  if (role === "admin") {
    return [...allRoutes, ...baseRoutes];
  }

  // If employee → filter by permission keys
  const filtered = allRoutes.filter((route) => {
    if (!route.permission) return true;
    return permissions[route.permission] === true;
  });

  return [...filtered, ...baseRoutes];
};

const routes = getFilteredRoutes();

export default routes;
