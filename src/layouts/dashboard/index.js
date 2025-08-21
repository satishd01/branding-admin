// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Fade } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CelebrationIcon from "@mui/icons-material/Celebration";

// Custom components
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// React
import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    posts: { total: 0 },
    postCategories: { total: 0, active: 0, inactive: 0 },
    postTemplates: { total: 0 },
    festivals: { total: 0, active: 0, inactive: 0 },
    banners: { total: 0, home: 0, bottom: 0 },
    businessCards: { total: 0, active: 0, inactive: 0 },
    businessCardCategories: { total: 0, active: 0, inactive: 0 },
  });

  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

  const [openWelcome, setOpenWelcome] = useState(role === "employee");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("https://branding.shellcode.website/api/admin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();
        if (result.status && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (openWelcome) {
      const timer = setTimeout(() => {
        setOpenWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openWelcome]);

  // Custom icons
  const ActiveIcon = () => (
    <Icon style={{ color: "#4CAF50", fontSize: "1rem", verticalAlign: "middle" }}>
      check_circle
    </Icon>
  );

  const InactiveIcon = () => (
    <Icon style={{ color: "#F44336", fontSize: "1rem", verticalAlign: "middle" }}>
      highlight_off
    </Icon>
  );

  const HomeIcon = () => (
    <Icon style={{ color: "#2196F3", fontSize: "1rem", verticalAlign: "middle" }}>home</Icon>
  );

  const BottomIcon = () => (
    <Icon style={{ color: "#795548", fontSize: "1rem", verticalAlign: "middle" }}>
      vertical_align_bottom
    </Icon>
  );

  const showIfPermitted = (key) => role === "admin" || permissions[key];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {role === "admin" && (
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="people"
                title="Users"
                count={stats.users.total}
                percentage={{
                  color: stats.users.active > stats.users.inactive ? "success" : "error",
                  amount:
                    stats.users.total > 0
                      ? `${Math.round((stats.users.active / stats.users.total) * 100)}%`
                      : "0%",
                  label: "active",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" pt="1rem">
                  <MDBox>
                    <ActiveIcon /> Active: {stats.users.active}
                  </MDBox>
                  <MDBox>
                    <InactiveIcon /> Inactive: {stats.users.inactive}
                  </MDBox>
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          )}

          {/* Posts */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="primary"
              icon="article"
              title="Posts"
              count={stats.posts.total}
              percentage={{
                color: "info",
                label: "total posts",
              }}
            />
          </Grid>

          {/* Post Categories */}
          {showIfPermitted("postCategories") && (
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="success"
                icon="category"
                title="Post Categories"
                count={stats.postCategories.total}
                percentage={{
                  color:
                    stats.postCategories.active > stats.postCategories.inactive
                      ? "success"
                      : "error",
                  amount:
                    stats.postCategories.total > 0
                      ? `${Math.round(
                          (stats.postCategories.active / stats.postCategories.total) * 100
                        )}%`
                      : "0%",
                  label: "active",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" pt="1rem">
                  <MDBox>
                    <ActiveIcon /> Active: {stats.postCategories.active}
                  </MDBox>
                  <MDBox>
                    <InactiveIcon /> Inactive: {stats.postCategories.inactive}
                  </MDBox>
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          )}

          {/* Post Templates */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="warning"
              icon="widgets"
              title="Post Templates"
              count={stats.postTemplates.total}
              percentage={{
                color: "info",
                label: "total templates",
              }}
            />
          </Grid>

          {/* Festivals */}
          {showIfPermitted("festival") && (
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="dark"
                icon="celebration"
                title="Festivals"
                count={stats.festivals.total}
                percentage={{
                  color: stats.festivals.active > stats.festivals.inactive ? "success" : "error",
                  amount:
                    stats.festivals.total > 0
                      ? `${Math.round((stats.festivals.active / stats.festivals.total) * 100)}%`
                      : "0%",
                  label: "active",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" pt="1rem">
                  <MDBox>
                    <ActiveIcon /> Active: {stats.festivals.active}
                  </MDBox>
                  <MDBox>
                    <InactiveIcon /> Inactive: {stats.festivals.inactive}
                  </MDBox>
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          )}

          {/* Banners */}
          {showIfPermitted("banners") && (
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="error"
                icon="image"
                title="Banners"
                count={stats.banners.total}
                percentage={{
                  color: "info",
                  amount:
                    stats.banners.total > 0
                      ? `${Math.round((stats.banners.home / stats.banners.total) * 100)}%`
                      : "0%",
                  label: "home banners",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" pt="1rem">
                  <MDBox>
                    <HomeIcon /> Home: {stats.banners.home}
                  </MDBox>
                  <MDBox>
                    <BottomIcon /> Bottom: {stats.banners.bottom}
                  </MDBox>
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          )}

          {/* Business Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="secondary"
              icon="business"
              title="Business Cards"
              count={stats.businessCards.total}
              percentage={{
                color:
                  stats.businessCards.active > stats.businessCards.inactive ? "success" : "error",
                amount:
                  stats.businessCards.total > 0
                    ? `${Math.round(
                        (stats.businessCards.active / stats.businessCards.total) * 100
                      )}%`
                    : "0%",
                label: "active",
              }}
            >
              <MDBox display="flex" justifyContent="space-between" pt="1rem">
                <MDBox>
                  <ActiveIcon /> Active: {stats.businessCards.active}
                </MDBox>
                <MDBox>
                  <InactiveIcon /> Inactive: {stats.businessCards.inactive}
                </MDBox>
              </MDBox>
            </ComplexStatisticsCard>
          </Grid>

          {/* Business Card Categories */}
          {showIfPermitted("businessCardCategory") && (
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="style"
                title="Card Categories"
                count={stats.businessCardCategories.total}
                percentage={{
                  color:
                    stats.businessCardCategories.active > stats.businessCardCategories.inactive
                      ? "success"
                      : "error",
                  amount:
                    stats.businessCardCategories.total > 0
                      ? `${Math.round(
                          (stats.businessCardCategories.active /
                            stats.businessCardCategories.total) *
                            100
                        )}%`
                      : "0%",
                  label: "active",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" pt="1rem">
                  <MDBox>
                    <ActiveIcon /> Active: {stats.businessCardCategories.active}
                  </MDBox>
                  <MDBox>
                    <InactiveIcon /> Inactive: {stats.businessCardCategories.inactive}
                  </MDBox>
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          )}
        </Grid>
      </MDBox>

      {/* Enhanced Welcome Dialog */}
      <Dialog
        open={openWelcome}
        TransitionComponent={Fade}
        keepMounted
        onClose={() => setOpenWelcome(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Card sx={{ background: "transparent", boxShadow: "none" }}>
          <CardContent sx={{ textAlign: "center", py: 5, px: 4 }}>
            <CelebrationIcon
              sx={{
                fontSize: 60,
                color: "#fff",
                mb: 2,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            />

            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Welcome, {user.name || "Team Member"}!
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                fontWeight: 400,
              }}
            >
              We&#39;re thrilled to have you back. Let&#39;s make today productive!
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenWelcome(false)}
              sx={{
                mt: 2,
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: "#fff",
                color: "#764ba2",
                "&:hover": {
                  background: "rgba(255,255,255,0.9)",
                },
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
