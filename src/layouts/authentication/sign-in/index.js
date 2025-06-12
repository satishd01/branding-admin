import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import bgImage from "assets/images/logos/logo.png";
import logo from "assets/images/logos/logo.png";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://business-branding.synoventum.site";

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleToggleRole = () => setIsAdmin(!isAdmin);

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const redirectBasedOnPermissions = (permissions) => {
    const routeMap = {
      dashboard: "/dashboard",
      user_management: "/users",
      banner_management: "/banners",
      festival_management: "/festival",
      card_category: "/business-card-category",
      post_category: "/post-categories",
      employee_management: "/employees",
    };

    if (permissions.dashboard) {
      navigate("/dashboard");
      return;
    }

    const firstAllowed = Object.keys(routeMap).find((key) => permissions[key]);
    if (firstAllowed) {
      navigate(routeMap[firstAllowed]);
    } else {
      navigate("/no-access");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiUrl = isAdmin ? `${BASE_URL}/api/admin/login` : `${BASE_URL}/api/employees/login`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [isAdmin ? "email" : "emailid"]: email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response format");
      }

      const data = await response.json();

      if (data.status) {
        const user = data.data.admin || data.data.employee;
        const role = data.data.admin ? "admin" : "employee";
        const permissions = user.permissions || {};

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("id", String(user.id));
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("role", role);
        localStorage.setItem("permissions", JSON.stringify(permissions));

        setSnackbarMessage(data.message || "Login successful");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setTimeout(() => {
          if (role === "admin") {
            navigate("/dashboard");
          } else {
            redirectBasedOnPermissions(permissions);
          }
        }, 1000);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarMessage(error.message || "Connection error");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          borderRadius="lg"
          mx={2}
          mt={1}
          p={2}
          mb={1}
          textAlign="center"
          sx={{
            backgroundColor: "#E8F5E9",
            boxShadow: "0px 4px 20px rgba(76, 175, 80, 0.3)",
          }}
        >
          <MDBox mb={2}>
            <img src={logo} alt="Logo" style={{ maxWidth: "100px", marginBottom: "5px" }} />
          </MDBox>
          <MDTypography variant="h4" fontWeight="medium" color="dark" mt={1}>
            {isAdmin ? "Admin Login" : "Employee Login"}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            Toggle to {isAdmin ? "Employee" : "Admin"} Login
          </MDTypography>
          <Switch checked={isAdmin} onChange={handleToggleRole} />
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                fullWidth
                type="submit"
                disabled={isLoading}
                sx={{
                  backgroundColor: "#66BB6A",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "#4CAF50" },
                }}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </BasicLayout>
  );
}

export default SignIn;
