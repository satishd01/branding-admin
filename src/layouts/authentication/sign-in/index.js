// src/pages/authentication/sign-in/index.js
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
  const BASE_URL = "https://business-branding.synoventum.site";

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleToggleRole = () => setIsAdmin(!isAdmin);
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
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

      const data = await response.json();

      if (data.status || data.message === "Login successful") {
        const user = isAdmin ? data.data.admin : data.employee;
        const role = isAdmin ? "admin" : "employee";
        const token = isAdmin ? data.data.token : data.token;
        const permissions = user.permissions || {};

        // Store values
        localStorage.setItem("token", token);
        localStorage.setItem("id", String(user.id));
        localStorage.setItem("email", user.email || user.emailid);
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
            if (permissions.banners) navigate("/banners");
            else if (permissions.festival) navigate("/festival");
            else if (permissions.businessCardCategory) navigate("/business-card-category");
            else if (permissions.postCategories) navigate("/post-categories");
            else navigate("/no-access");
          }
        }, 800);
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
