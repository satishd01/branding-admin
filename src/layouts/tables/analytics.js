import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Chart from "react-apexcharts";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Analytics() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [rideStatsData, setRideStatsData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setErrors({});
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/authentication/sign-in");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Create promises for all API calls
        const endpoints = [
          {
            key: "userGrowth",
            url: `${BASE_URL}/v1/admin/analytics/user-growth?startDate=2025-03-01&endDate=2025-05-31&interval=daily`,
          },
          {
            key: "rideStats",
            url: `${BASE_URL}/v1/admin/analytics/ride-statistics`,
          },
          {
            key: "revenue",
            url: `${BASE_URL}/v1/admin/analytics/revenue`,
          },
          {
            key: "engagement",
            url: `${BASE_URL}/v1/admin/analytics/user-engagement?startDate=2025-03-01&endDate=2025-05-31`,
          },
        ];

        // Execute all API calls with error handling for each
        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            try {
              const response = await fetch(endpoint.url, { headers });
              if (!response.ok) {
                throw new Error(`permission denied for you`);
              }
              return response.json();
            } catch (error) {
              console.error(`Error fetching ${endpoint.key}:`, error);
              setErrors((prev) => ({
                ...prev,
                [endpoint.key]: error.message || `Failed to load ${endpoint.key} data`,
              }));
              return null;
            }
          })
        );

        // Set data for successful responses
        if (results[0]) setUserGrowthData(results[0].data);
        if (results[1]) setRideStatsData(results[1].data);
        if (results[2]) setRevenueData(results[2].data);
        if (results[3]) setEngagementData(results[3].data);
      } catch (err) {
        console.error("Error in fetchAllData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  // User Growth Chart
  const userGrowthOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    series: [
      {
        name: "Users",
        data: userGrowthData?.userGrowth?.map((item) => item.count) || [],
      },
      {
        name: "Hosts",
        data: userGrowthData?.hostGrowth?.map((item) => item.count) || [],
      },
    ],
    xaxis: {
      categories: userGrowthData?.userGrowth?.map((item) => item.date) || [],
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    title: {
      text: "User & Host Growth",
      align: "left",
    },
    legend: {
      position: "top",
    },
  };

  // Ride Status Chart
  const rideStatusOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    series: [
      {
        name: "Pending",
        data:
          rideStatsData?.trends
            ?.filter((item) => item.rideStatus === "pending")
            ?.map((item) => item.count) || [],
      },
      {
        name: "Confirmed",
        data:
          rideStatsData?.trends
            ?.filter((item) => item.rideStatus === "confirmed")
            ?.map((item) => item.count) || [],
      },
      {
        name: "Completed",
        data:
          rideStatsData?.trends
            ?.filter((item) => item.rideStatus === "completed")
            ?.map((item) => item.count) || [],
      },
    ],
    xaxis: {
      categories: [...new Set(rideStatsData?.trends?.map((item) => item.date))] || [],
    },
    colors: [theme.palette.warning.main, theme.palette.info.main, theme.palette.success.main],
    title: {
      text: "Ride Status Trends",
      align: "left",
    },
    legend: {
      position: "top",
    },
  };

  // Revenue Chart
  const revenueOptions = {
    chart: {
      type: "area",
      height: 350,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    series: [
      {
        name: "Revenue",
        data: revenueData?.trends?.map((item) => parseFloat(item.revenue)) || [],
      },
    ],
    xaxis: {
      categories: revenueData?.trends?.map((item) => item.date) || [],
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
    colors: [theme.palette.success.main],
    title: {
      text: "Revenue Trends",
      align: "left",
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
  };

  const KPICard = ({ title, value, subValue, icon, color, loading }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Typography variant="h4" component="div">
                  {value}
                </Typography>
                {subValue && (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subValue}
                  </Typography>
                )}
              </>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  KPICard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    loading: PropTypes.bool,
  };

  const ErrorPlaceholder = ({ message }) => (
    <Card>
      <CardContent>
        <Typography color="error">{message}</Typography>
      </CardContent>
    </Card>
  );

  ErrorPlaceholder.propTypes = {
    message: PropTypes.string.isRequired,
  };

  const hasData = (data) => {
    return data && Object.keys(data).length > 0;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <Collapse in={openAlert}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpenAlert(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Some data couldn&apos;t be loaded: {Object.values(errors).join(", ")}
            </Alert>
          </Collapse>
        )}

        {/* KPI Cards Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6} lg={3}>
            {errors.userGrowth ? (
              <ErrorPlaceholder message={errors.userGrowth} />
            ) : (
              <KPICard
                title="Total Users"
                value={userGrowthData?.totals?.users || 0}
                subValue={`${userGrowthData?.totals?.activeUsers || 0} active`}
                icon="👥"
                color={theme.palette.primary.main}
                loading={loading}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {errors.userGrowth ? (
              <ErrorPlaceholder message={errors.userGrowth} />
            ) : (
              <KPICard
                title="Total Hosts"
                value={userGrowthData?.totals?.hosts || 0}
                subValue={`${userGrowthData?.totals?.activeHosts || 0} active`}
                icon="🏠"
                color={theme.palette.secondary.main}
                loading={loading}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {errors.revenue ? (
              <ErrorPlaceholder message={errors.revenue} />
            ) : (
              <KPICard
                title="Total Revenue"
                value={`$${revenueData?.overview?.totalRevenue?.toFixed(2) || 0}`}
                subValue={`Avg: $${parseFloat(
                  revenueData?.overview?.averageRideAmount || 0
                ).toFixed(2)}`}
                icon="💰"
                color={theme.palette.success.main}
                loading={loading}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {errors.rideStats ? (
              <ErrorPlaceholder message={errors.rideStats} />
            ) : (
              <KPICard
                title="Total Rides"
                value={rideStatsData?.overview?.totalRides || 0}
                subValue={`${rideStatsData?.overview?.completedRides || 0} completed`}
                icon="🚗"
                color={theme.palette.info.main}
                loading={loading}
              />
            )}
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            {errors.userGrowth ? (
              <ErrorPlaceholder message={errors.userGrowth} />
            ) : hasData(userGrowthData) ? (
              <Card>
                <CardContent>
                  <Chart
                    options={userGrowthOptions}
                    series={userGrowthOptions.series}
                    type="line"
                    height={350}
                  />
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No user growth data available" />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {errors.rideStats ? (
              <ErrorPlaceholder message={errors.rideStats} />
            ) : hasData(rideStatsData) ? (
              <Card>
                <CardContent>
                  <Chart
                    options={rideStatusOptions}
                    series={rideStatusOptions.series}
                    type="bar"
                    height={350}
                  />
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No ride statistics data available" />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            {errors.revenue ? (
              <ErrorPlaceholder message={errors.revenue} />
            ) : hasData(revenueData) ? (
              <Card>
                <CardContent>
                  <Chart
                    options={revenueOptions}
                    series={revenueOptions.series}
                    type="area"
                    height={350}
                  />
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No revenue data available" />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {errors.rideStats ? (
              <ErrorPlaceholder message={errors.rideStats} />
            ) : hasData(rideStatsData) ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ride Statistics Overview
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Rides</TableCell>
                          <TableCell align="right">
                            {rideStatsData?.overview?.totalRides || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Completed Rides</TableCell>
                          <TableCell align="right">
                            {rideStatsData?.overview?.completedRides || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Cancelled Rides</TableCell>
                          <TableCell align="right">
                            {rideStatsData?.overview?.cancelledRides || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Avg Passengers</TableCell>
                          <TableCell align="right">
                            {parseFloat(rideStatsData?.overview?.avgPassengers || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Distance (km)</TableCell>
                          <TableCell align="right">
                            {rideStatsData?.overview?.totalDistance || 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No ride statistics data available" />
            )}
          </Grid>
        </Grid>

        {/* User Engagement Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {errors.engagement ? (
              <ErrorPlaceholder message={errors.engagement} />
            ) : hasData(engagementData) ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Engagement Metrics
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Active Users</TableCell>
                          <TableCell align="right">
                            {engagementData?.overview?.activeUsers || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Inactive Users</TableCell>
                          <TableCell align="right">
                            {engagementData?.overview?.inactiveUsers || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Cancellations</TableCell>
                          <TableCell align="right">
                            {engagementData?.overview?.totalCancellations || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Engagement Rate</TableCell>
                          <TableCell align="right">
                            {engagementData?.overview?.engagementRate !== null
                              ? `${(engagementData.overview.engagementRate * 100).toFixed(2)}%`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No engagement data available" />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {errors.revenue ? (
              <ErrorPlaceholder message={errors.revenue} />
            ) : hasData(revenueData) ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Revenue Trends
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Rides</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {revenueData?.trends?.slice(0, 5).map((trend) => (
                          <TableRow key={trend.date}>
                            <TableCell>{trend.date}</TableCell>
                            <TableCell align="right">
                              ${parseFloat(trend.revenue).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">{trend.rides}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <ErrorPlaceholder message="No revenue data available" />
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
