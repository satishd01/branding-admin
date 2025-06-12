import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

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
      console.log("Attempting login:", { role: isAdmin ? "admin" : "employee", email });

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [isAdmin ? "email" : "emailid"]: email,
          password,
        }),
      });

      console.log("Response status:", res.status);

      const data = await res.json().catch((err) => {
        console.error("JSON parse error:", err);
        throw new Error("Invalid JSON response from server");
      });
      console.log("Response data:", data);

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Login failed");
      }

      const user = data.data.admin || data.data.employee;
      const role = data.data.admin ? "admin" : "employee";
      const permissions = user.permissions || {};

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("id", String(user.id));
      localStorage.setItem("email", user.email || user.emailid);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", JSON.stringify(permissions));

      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          // Prioritize pages if employee
          if (permissions.banners) navigate("/banners");
          else if (permissions.festival) navigate("/festival");
          else if (permissions.businessCardCategory) navigate("/business-card-category");
          else if (permissions.postCategories) navigate("/post-categories");
          else navigate("/dashboard"); // Fallback
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setSnackbarMessage(err.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox textAlign="center" p={2} sx={{ backgroundColor: "#E8F5E9" }}>
          <img src={logo} alt="Logo" style={{ width: 100, margin: "auto" }} />
          <MDTypography variant="h4">{isAdmin ? "Admin" : "Employee"} Login</MDTypography>
          <Typography variant="caption">Switch to {isAdmin ? "Employee" : "Admin"}</Typography>
          <Switch checked={isAdmin} onChange={handleToggleRole} />
        </MDBox>

        <MDBox p={3}>
          <form onSubmit={handleSubmit}>
            <MDInput
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDInput
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <MDButton
              type="submit"
              variant="gradient"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </MDButton>
          </form>
        </MDBox>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </BasicLayout>
  );
}

export default SignIn;
