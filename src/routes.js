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

// @mui icons
import Icon from "@mui/material/Icon";
// import { Rating } from "@mui/material";

// Define routes
const routes = [
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/analytics",
    component: <Analytics />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Hosts />,
  },
  {
    type: "collapse",
    name: "Rides",
    key: "rides",
    icon: <Icon fontSize="small">directions_car</Icon>,
    route: "/rides",
    component: <Rides />,
  },
  {
    type: "collapse",
    name: "Promotions",
    key: "promotions",
    icon: <Icon fontSize="small">local_offer</Icon>,
    route: "/promotions",
    component: <Promotions />,
  },
  // {
  //   type: "collapse",
  //   name: "Dynamic Pricing",
  //   key: "dynamic-pricing",
  //   icon: <Icon fontSize="small">trending_up</Icon>,
  //   route: "/dynamic-pricing",
  //   component: <DynamicPricing />,
  // },
  {
    type: "collapse",
    name: "Banners",
    key: "banners",
    icon: <Icon fontSize="small">image</Icon>,
    route: "/banners",
    component: <Banner />,
  },
  {
    type: "collapse",
    name: "Disputes",
    key: "disputes",
    icon: <Icon fontSize="small">report</Icon>,
    route: "/disputes",
    component: <Disputemanagement />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Rating",
    key: "rating",
    icon: <Icon fontSize="small">star</Icon>,
    route: "/rating",
    component: <Rating />,
  },
  {
    type: "collapse",
    name: "Content",
    key: "content",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/content",
    component: <Content />,
  },
  {
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
