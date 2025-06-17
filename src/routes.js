// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Banner from "layouts/tables/banners";
import Hosts from "layouts/tables/user";
import Festival from "layouts/tables/festival";
import BusinessCardCategory from "layouts/tables/BusinessCardCategory";
import PostCategories from "layouts/tables/PostCategories";
import Employees from "layouts/tables/employee";
import Frames from "layouts/tables/Frames";
import Post from "layouts/tables/Post";

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

// Routes that don't require permissions
const baseRoutes = [
  {
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

// All app routes (with optional permission keys)
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
    permission: "users", // only shown to admin
  },
  {
    type: "collapse",
    name: "Banners",
    key: "banners",
    icon: <Icon fontSize="small">collections</Icon>,
    route: "/banners",
    component: <Banner />,
    permission: "banners",
  },
  {
    type: "collapse",
    name: "Festival",
    key: "festival",
    icon: <Icon fontSize="small">celebration</Icon>,
    route: "/festival",
    component: <Festival />,
    permission: "festival",
  },
  {
    type: "collapse",
    name: "Business Card Category",
    key: "business-card-category",
    icon: <Icon fontSize="small">contact_mail</Icon>,
    route: "/business-card-category",
    component: <BusinessCardCategory />,
    permission: "businessCardCategory",
  },
  {
    type: "collapse",
    name: "Post Categories",
    key: "post-categories",
    icon: <Icon fontSize="small">bookmark</Icon>,
    route: "/post-categories",
    component: <PostCategories />,
    permission: "postCategories",
  },
  {
    type: "collapse",
    name: "Posts",
    key: "posts",
    icon: <Icon fontSize="small">article</Icon>,
    route: "/posts",
    component: <Post />,
    // permission: "posts", // optional
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/employees",
    component: <Employees />,
    permission: "employees", // optional
  },
  {
    type: "collapse",
    name: "Frames",
    key: "frames",
    icon: <Icon fontSize="small">photo_frame</Icon>,
    route: "/frames",
    component: <Frames />,
  },
];

// Filter routes based on role and permission
const getFilteredRoutes = () => {
  const role = getUserRole();
  const permissions = getPermissions();

  if (role === "admin") {
    return [...allRoutes, ...baseRoutes];
  }

  // For employee: filter routes based on permissions
  const filtered = allRoutes.filter((route) => {
    // No permission key = allow access
    if (!route.permission) return true;

    // permission key present = must be true in employee permissions
    return permissions[route.permission] === true;
  });

  return [...filtered, ...baseRoutes];
};

const routes = getFilteredRoutes();
export default routes;
