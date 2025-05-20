// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import { useEffect, useState } from "react";

function Dashboard() {
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    const fetchVendorCount = async () => {
      try {
        const response = await fetch("https://deardabba.shellcode.store/api/admin/vendors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbjFAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDU4MzYwMjAsImV4cCI6MTc0NTkyMjQyMH0.myJ1vmKkoTZbljhYQ1PIX0Ss6iu0jRIof2hm_9qN_X4",
          },
        });

        const data = await response.json();
        setVendorCount(data.pagination?.total || 0); // Safely access total
      } catch (error) {
        console.error("Error fetching vendor count:", error);
      }
    };

    fetchVendorCount();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}></Grid>
        {/* Displaying dashboard stats */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="store"
                title="Total Vendors"
                count={vendorCount}
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
