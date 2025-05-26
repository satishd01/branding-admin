// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Banner from "layouts/tables/banners";
import Hosts from "layouts/tables/user";
import Festival from "layouts/tables/festival";
import BusinessCardCategory from "layouts/tables/BusinessCardCategory";
import PostCategories from "layouts/tables/PostCategories";

// @mui icons
import Icon from "@mui/material/Icon";

// Define base routes that everyone can access
const routes = [
  {
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
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
    icon: <Icon fontSize="small">group</Icon>, // Changed from 'people' to 'group' (more modern)
    route: "/users",
    component: <Hosts />,
    permission: "user_management",
  },
  {
    type: "collapse",
    name: "Banners",
    key: "banners",
    icon: <Icon fontSize="small">collections</Icon>, // Changed from 'image' to 'collections' (better for multiple banners)
    route: "/banners",
    component: <Banner />,
  },
  {
    type: "collapse",
    name: "Festival",
    key: "festival",
    icon: <Icon fontSize="small">celebration</Icon>, // More specific than 'festival'
    route: "/festival",
    component: <Festival />,
  },
  {
    type: "collapse",
    name: "Business Card Category",
    key: "business-card-category",
    icon: <Icon fontSize="small">contact_mail</Icon>, // Represents business cards better
    route: "/business-card-category",
    component: <BusinessCardCategory />,
  },
  {
    type: "collapse",
    name: "Post Categories",
    key: "post-categories",
    icon: <Icon fontSize="small">bookmark</Icon>, // Changed from 'category' to differentiate from business card categories
    route: "/post-categories",
    component: <PostCategories />,
  },
];

export default routes;
