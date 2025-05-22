import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Divider,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  Rating,
  Avatar,
  Typography,
  Chip,
  Paper,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Ratings() {
  const theme = useTheme();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewRatingData, setViewRatingData] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRatings();
  }, [ratingFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      let url = `${BASE_URL}/v1/ratings/get`;
      if (ratingFilter !== "all") {
        url += `?rating=${ratingFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const data = await response.json();
      setRatings(data.data.ratings);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching ratings:", error);
      showSnackbar("Error fetching ratings", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/ratings/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rating details");
      }

      const data = await response.json();
      setViewRatingData(data.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching rating details:", error);
      showSnackbar("Error fetching rating details", "error");
    }
  };

  const handleViewRating = (rating) => {
    fetchRatingById(rating.rating.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderRatingStars = (value) => {
    return (
      <Box display="flex" alignItems="center">
        <Rating
          value={value}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <MDTypography variant="caption" ml={1}>
          ({value})
        </MDTypography>
      </Box>
    );
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const UserCell = ({ value }) => (
    <Box display="flex" alignItems="center">
      <Avatar src={value?.profilePhoto} sx={{ width: 32, height: 32, mr: 1 }}>
        {value?.name ? value.name.charAt(0) : <PersonIcon />}
      </Avatar>
      <Box>
        <MDTypography variant="caption" fontWeight="medium">
          {value?.name || "N/A"}
        </MDTypography>
        <MDTypography variant="caption" display="block">
          {value?.email || "N/A"}
        </MDTypography>
      </Box>
    </Box>
  );

  UserCell.propTypes = {
    value: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      profilePhoto: PropTypes.string,
    }),
  };

  const columns = [
    { Header: "ID", accessor: (row) => row.rating.id },
    {
      Header: "User",
      accessor: "user",
      Cell: ({ value }) => <UserCell value={value} />,
    },
    {
      Header: "Ride",
      accessor: (row) =>
        `#${row.rideCreation.id}: ${row.rideCreation.pickupAddress} → ${row.rideCreation.dropAddress}`,
      Cell: ({ value }) => (
        <MDTypography
          variant="caption"
          sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}
        >
          {value}
        </MDTypography>
      ),
    },
    {
      Header: "Rating",
      accessor: (row) => row.rating.rating,
      Cell: ({ value }) => renderRatingStars(value),
    },
    {
      Header: "Date",
      accessor: (row) => formatDate(row.rating.createdAt),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton onClick={() => handleViewRating(row.original)}>
            <VisibilityIcon color="info" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const filteredRatings = Array.isArray(ratings)
    ? ratings.filter((rating) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (rating.rating.id && rating.rating.id.toString().includes(searchTermLower)) ||
          (rating.user?.name && rating.user.name.toLowerCase().includes(searchTermLower)) ||
          (rating.user?.email && rating.user.email.toLowerCase().includes(searchTermLower)) ||
          (rating.rideCreation?.pickupAddress &&
            rating.rideCreation.pickupAddress.toLowerCase().includes(searchTermLower)) ||
          (rating.rideCreation?.dropAddress &&
            rating.rideCreation.dropAddress.toLowerCase().includes(searchTermLower)) ||
          (rating.rating.review && rating.rating.review.toLowerCase().includes(searchTermLower))
        );
      })
    : [];

  // Apply pagination
  const paginatedRatings = filteredRatings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <CircularProgress />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="white"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <MDTypography variant="h6" color="black">
                    Ratings Management
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Rating</InputLabel>
                      <Select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        label="Rating"
                        sx={{
                          width: 150,
                          height: 35,
                        }}
                      >
                        <MenuItem value="all">All Ratings</MenuItem>
                        <MenuItem value="1">1 Star</MenuItem>
                        <MenuItem value="2">2 Stars</MenuItem>
                        <MenuItem value="3">3 Stars</MenuItem>
                        <MenuItem value="4">4 Stars</MenuItem>
                        <MenuItem value="5">5 Stars</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search ratings"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        width: { xs: "100%", sm: 200 },
                        [theme.breakpoints.down("sm")]: {
                          marginBottom: 2,
                        },
                      }}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedRatings }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredRatings.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Rating Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Rating Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewRatingData && (
            <MDBox>
              {/* Rating Information */}
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Rating Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Rating ID:</strong> {viewRatingData.rating.id}
                    </MDTypography>
                    <MDTypography>
                      <strong>Rating:</strong> {renderRatingStars(viewRatingData.rating.rating)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Date:</strong> {formatDate(viewRatingData.rating.createdAt)}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              {/* Ride Information */}
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Ride Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                      <MDTypography>
                        <strong>Pickup:</strong> {viewRatingData.rideCreation.pickupAddress}
                      </MDTypography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
                      <MDTypography>
                        <strong>Dropoff:</strong> {viewRatingData.rideCreation.dropAddress}
                      </MDTypography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <EventIcon color="action" sx={{ mr: 1 }} />
                      <MDTypography>
                        <strong>Date:</strong> {viewRatingData.rideCreation.date}
                      </MDTypography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <ScheduleIcon color="action" sx={{ mr: 1 }} />
                      <MDTypography>
                        <strong>Time:</strong> {viewRatingData.rideCreation.time}
                      </MDTypography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <DirectionsCarIcon color="action" sx={{ mr: 1 }} />
                      <MDTypography>
                        <strong>Vehicle:</strong> {viewRatingData.host.vehicleBrand}{" "}
                        {viewRatingData.host.vehicleModel} ({viewRatingData.host.vehicleNumber})
                      </MDTypography>
                    </Box>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              {/* User Information */}
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  User Information
                </MDTypography>
                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          src={viewRatingData.user.profilePhoto}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        >
                          {viewRatingData.user.name?.charAt(0) || <PersonIcon />}
                        </Avatar>
                        <Box>
                          <MDTypography variant="h6">{viewRatingData.user.name}</MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            User ID: {viewRatingData.user.id}
                          </MDTypography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                        <MDTypography>{viewRatingData.user.phoneNumber || "N/A"}</MDTypography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                        <MDTypography>{viewRatingData.user.email || "N/A"}</MDTypography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="subtitle2" gutterBottom>
                        <strong>Address:</strong>
                      </MDTypography>
                      <MDTypography paragraph>{viewRatingData.user.address || "N/A"}</MDTypography>
                      <Chip
                        label={viewRatingData.user.kycStatus || "N/A"}
                        color={viewRatingData.user.kycStatus === "approved" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </MDBox>

              {/* Host Information */}
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Host Information
                </MDTypography>
                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          src={viewRatingData.host.profilePhoto}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        >
                          {viewRatingData.host.name?.charAt(0) || <PersonIcon />}
                        </Avatar>
                        <Box>
                          <MDTypography variant="h6">{viewRatingData.host.name}</MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            Host ID: {viewRatingData.host.id}
                          </MDTypography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                        <MDTypography>{viewRatingData.host.mobileNumber || "N/A"}</MDTypography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                        <MDTypography>{viewRatingData.host.email || "N/A"}</MDTypography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="subtitle2" gutterBottom>
                        <strong>Vehicle Details:</strong>
                      </MDTypography>
                      <MDTypography paragraph>
                        {viewRatingData.host.vehicleBrand} {viewRatingData.host.vehicleModel} (
                        {viewRatingData.host.vehicleRegistrationYear})
                      </MDTypography>
                      <Chip
                        label={viewRatingData.host.kycStatus || "N/A"}
                        color={viewRatingData.host.kycStatus === "approved" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </MDBox>

              {/* Review Section */}
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Review
                </MDTypography>
                <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                  <MDTypography variant="body1">
                    {viewRatingData.rating.review || "No review provided"}
                  </MDTypography>
                </Paper>
              </MDBox>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

Ratings.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      rating: PropTypes.shape({
        id: PropTypes.number.isRequired,
        createdRideId: PropTypes.string.isRequired,
        hostId: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        review: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
      }).isRequired,
      rideCreation: PropTypes.object.isRequired,
      host: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Ratings;
