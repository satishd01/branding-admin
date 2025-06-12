// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "https://business-branding.synoventum.site/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0Nzk5MjI3MSwiZXhwIjoxNzQ4MDc4NjcxfQ.XrHN70Hc3lvT3xSdEBqrBVKV78UzrI1qJyLMEnr7JYE",
            },
          }
        );

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

  // Custom icon components with different colors
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Users Card */}
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

          {/* Posts Card */}
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

          {/* Post Categories Card */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="category"
              title="Post Categories"
              count={stats.postCategories.total}
              percentage={{
                color:
                  stats.postCategories.active > stats.postCategories.inactive ? "success" : "error",
                amount:
                  stats.postCategories.total > 0
                    ? `${Math.round((stats.postCategories.active / stats.postCategories.total) * 100)}%`
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

          {/* Post Templates Card */}
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

          {/* Festivals Card */}
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

          {/* Banners Card */}
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

          {/* Business Cards Card */}
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
                    ? `${Math.round((stats.businessCards.active / stats.businessCards.total) * 100)}%`
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

          {/* Business Card Categories Card */}
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
                    ? `${Math.round((stats.businessCardCategories.active / stats.businessCardCategories.total) * 100)}%`
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
