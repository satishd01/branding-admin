// @mui material components
import Grid from "@mui/material/Grid";

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
    users: 0,
    posts: 0,
    postTemplates: 0,
    banners: 0,
    businessCards: 0,
    businessCardCategories: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "https://business-branding.synoventum.site/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "text/plain",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0Nzk5MjI3MSwiZXhwIjoxNzQ4MDc4NjcxfQ.XrHN70Hc3lvT3xSdEBqrBVKV78UzrI1qJyLMEnr7JYE",
            },
          }
        );

        const result = await response.json();
        const data = result.data;

        setStats({
          users: data.users?.total || 0,
          posts: data.posts?.total || 0,
          postTemplates: data.postTemplates?.total || 0,
          banners: data.banners?.total || 0,
          businessCards: data.businessCards?.total || 0,
          businessCardCategories: data.businessCardCategories?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="people"
                title="Total Users"
                count={stats.users}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="article"
                title="Total Posts"
                count={stats.posts}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="widgets"
                title="Post Templates"
                count={stats.postTemplates}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="image"
                title="Banners"
                count={stats.banners}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="business"
                title="Business Cards"
                count={stats.businessCards}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="category"
                title="Card Categories"
                count={stats.businessCardCategories}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
