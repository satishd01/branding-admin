// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Analytics from "layouts/tables/analytics";
import Vendors from "layouts/tables/vendor";
import Hosts from "layouts/tables/user";
import Rides from "layouts/tables/ride";
import Promotions from "layouts/tables/promotion";
import Disputes from "layouts/tables/dispute";
import Disputemanagement from "layouts/tables/dispute";
import DynamicPricing from "layouts/tables/dynamic-pricing";
import Banner from "layouts/tables/banners";
import Notifications from "layouts/tables/notifications";
import Content from "layouts/tables/content";
import Rating from "layouts/tables/ratings";
import AdminUsers from "layouts/tables/admin";

// @mui icons
import Icon from "@mui/material/Icon";

// Function to check permissions
const hasPermission = (permissionKey) => {
  // Get permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  // If permissions exist, check the specific permission
  return permissions ? permissions[permissionKey] === true : false;
};

// Define base routes that everyone can access
const baseRoutes = [
  {
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

// Define all possible routes with their required permissions
const allRoutes = [
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/analytics",
    component: <Analytics />,
    permission: "analytics",
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Hosts />,
    permission: "user_management",
  },
  {
    type: "collapse",
    name: "Admin Users",
    key: "admin-users",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/admin-users",
    component: <AdminUsers />,
    permission: "user_management",
  },
  {
    type: "collapse",
    name: "Rides",
    key: "rides",
    icon: <Icon fontSize="small">directions_car</Icon>,
    route: "/rides",
    component: <Rides />,
    permission: "ride_management",
  },
  {
    type: "collapse",
    name: "Promotions",
    key: "promotions",
    icon: <Icon fontSize="small">local_offer</Icon>,
    route: "/promotions",
    component: <Promotions />,
    permission: "promotion_management",
  },
  {
    type: "collapse",
    name: "Dynamic Pricing",
    key: "dynamic-pricing",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/dynamic-pricing",
    component: <DynamicPricing />,
    permission: "dynamic_pricing",
  },
  {
    type: "collapse",
    name: "Banners",
    key: "banners",
    icon: <Icon fontSize="small">image</Icon>,
    route: "/banners",
    component: <Banner />,
    permission: "promotion_management",
  },
  {
    type: "collapse",
    name: "Disputes",
    key: "disputes",
    icon: <Icon fontSize="small">report</Icon>,
    route: "/disputes",
    component: <Disputemanagement />,
    permission: "dispute_management",
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    permission: "promotion_management",
  },
  {
    type: "collapse",
    name: "Rating",
    key: "rating",
    icon: <Icon fontSize="small">star</Icon>,
    route: "/rating",
    component: <Rating />,
    permission: "rating",
  },
  {
    type: "collapse",
    name: "Content",
    key: "content",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/content",
    component: <Content />,
    permission: "promotion_management",
  },
];

// Filter routes based on permissions
const getFilteredRoutes = () => {
  // If no permissions are set (not logged in), return only base routes
  if (!localStorage.getItem("permissions")) {
    return baseRoutes;
  }

  // Filter routes based on permissions
  const filteredRoutes = allRoutes.filter((route) => {
    // If route doesn't require specific permission, include it
    if (!route.permission) return true;
    // Otherwise check permission
    return hasPermission(route.permission);
  });

  // Return base routes plus filtered routes
  return [...filteredRoutes, ...baseRoutes];
};

// Export the filtered routes
const routes = getFilteredRoutes();

export default routes;
