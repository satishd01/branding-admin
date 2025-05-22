import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Divider,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  Rating,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Ratings() {
  const theme = useTheme();
  const [ratings, setRatings] = useState([]);
  const [rides, setRides] = useState([]); // New state for rides
  const [loading, setLoading] = useState(true);
  const [ridesLoading, setRidesLoading] = useState(false); // Loading state for rides
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewRatingData, setViewRatingData] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newRatingData, setNewRatingData] = useState({
    createdRideId: "",
    rating: 0,
    review: "",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRatings();
    fetchRides(); // Fetch rides when component mounts
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const data = await response.json();
      setRatings(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching ratings:", error);
      showSnackbar("Error fetching ratings", "error");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch rides
  const fetchRides = async () => {
    try {
      setRidesLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/rides?type=ride&status=completed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rides");
      }

      const data = await response.json();
      setRides(data.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
      showSnackbar("Error fetching rides", "error");
    } finally {
      setRidesLoading(false);
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
        headers: {
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
    fetchRatingById(rating.id);
  };

  const handleOpenCreateDialog = () => {
    setNewRatingData({
      createdRideId: "",
      rating: 0,
      review: "",
    });
    setOpenCreateDialog(true);
  };

  const handleCreateRating = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/ratings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRatingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create rating");
      }

      showSnackbar("Rating created successfully");
      setOpenCreateDialog(false);
      fetchRatings();
    } catch (error) {
      console.error("Error creating rating:", error);
      showSnackbar(error.message || "Error creating rating", "error");
    }
  };

  const handleDeleteRating = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/ratings/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }

      showSnackbar("Rating deleted successfully");
      fetchRatings();
    } catch (error) {
      console.error("Error deleting rating:", error);
      showSnackbar(error.message || "Error deleting rating", "error");
    }
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
      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
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
    }),
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    {
      Header: "User",
      accessor: "User",
      Cell: UserCell,
    },
    { Header: "Ride ID", accessor: "createdRideId" },
    {
      Header: "Rating",
      accessor: "rating",
      Cell: ({ value }) => renderRatingStars(value),
    },
    {
      Header: "Date",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
          <Box>
            <Tooltip title="View Details">
              <IconButton onClick={() => handleViewRating(row.original)}>
                <VisibilityIcon color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="More actions">
              <IconButton
                onClick={handleClick}
                aria-controls={open ? "actions-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="actions-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => handleDeleteRating(row.original.id)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];

  const filteredRatings = Array.isArray(ratings)
    ? ratings.filter((rating) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (rating.id && rating.id.toString().includes(searchTermLower)) ||
          (rating.User?.name && rating.User.name.toLowerCase().includes(searchTermLower)) ||
          (rating.User?.email && rating.User.email.toLowerCase().includes(searchTermLower)) ||
          (rating.createdRideId && rating.createdRideId.toString().includes(searchTermLower)) ||
          (rating.review && rating.review.toLowerCase().includes(searchTermLower))
        );
      })
    : [];

  // Apply pagination
  const paginatedRatings = filteredRatings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading || ridesLoading) {
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
                    <Button
                      variant="contained"
                      color="info"
                      startIcon={<AddIcon />}
                      onClick={handleOpenCreateDialog}
                    >
                      Add Rating
                    </Button>
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
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewRatingData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Ride ID:</strong> {viewRatingData.createdRideId}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Rating:</strong> {renderRatingStars(viewRatingData.rating)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Date:</strong> {formatDate(viewRatingData.createdAt)}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  User Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewRatingData.User?.name || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Email:</strong> {viewRatingData.User?.email || "N/A"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Review
                </MDTypography>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <MDTypography variant="body2">
                    {viewRatingData.review || "No review provided"}
                  </MDTypography>
                </Box>
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

      {/* Create Rating Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Add New Rating</MDTypography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Ride</InputLabel>
                  <Select
                    value={newRatingData.createdRideId}
                    onChange={(e) =>
                      setNewRatingData({ ...newRatingData, createdRideId: e.target.value })
                    }
                    label="Ride"
                  >
                    {rides.map((ride) => (
                      <MenuItem key={ride.id} value={ride.id}>
                        Ride #{ride.id} - {ride.pickupLocation} to {ride.dropoffLocation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MDTypography component="legend">Rating</MDTypography>
                <Rating
                  value={newRatingData.rating}
                  onChange={(event, newValue) => {
                    setNewRatingData({ ...newRatingData, rating: newValue });
                  }}
                  precision={0.5}
                  size="large"
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Review (Optional)"
                  multiline
                  rows={4}
                  value={newRatingData.review}
                  onChange={(e) => setNewRatingData({ ...newRatingData, review: e.target.value })}
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRating} color="primary" variant="contained">
            Add Rating
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
      id: PropTypes.number.isRequired,
      createdRideId: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      review: PropTypes.string,
      User: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Ratings;
