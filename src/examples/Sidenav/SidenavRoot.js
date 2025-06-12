// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { transitions, breakpoints, functions, boxShadows } = theme;
  const { miniSidenav, transparentSidenav } = ownerState;

  const sidebarWidth = 250;
  const { pxToRem } = functions;
  const { xxl } = boxShadows;

  // ✅ Dark grey background
  const backgroundValue = "#2c2c2c";

  const drawerOpenStyles = () => ({
    background: backgroundValue,
    color: "#ffffff", // ✅ White text
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  const drawerCloseStyles = () => ({
    background: backgroundValue,
    color: "#ffffff", // ✅ White text
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",
      color: "#ffffff", // ✅ Apply white text to the drawer
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),

      // ✅ Force white color for all text and icons inside
      "& *": {
        color: "#ffffff !important",
      },
    },
  };
});
