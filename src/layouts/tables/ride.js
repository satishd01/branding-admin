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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Cancel from "@mui/icons-material/Cancel";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Rides() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("completed");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewRideData, setViewRideData] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusData, setStatusData] = useState({
    id: null,
    status: "pending",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRides();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/rides?type=ride&status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rides");
      }

      const data = await response.json();
      setRides(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching ride data:", error);
      showSnackbar("Error fetching rides", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRide = (ride) => {
    setViewRideData(ride);
    setOpenViewDialog(true);
  };

  const handleOpenStatusDialog = (ride) => {
    setStatusData({
      id: ride.id,
      status: ride.rideStatus || "pending",
    });
    setOpenStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/rides/${statusData.id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ride",
          status: statusData.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ride status");
      }

      showSnackbar("Ride status updated successfully");
      setOpenStatusDialog(false);
      fetchRides();
    } catch (error) {
      console.error("Error updating ride status:", error);
      showSnackbar(error.message || "Error updating ride status", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "confirmed":
        return <Chip label="Confirmed" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "pending":
        return <Chip label="Pending" color="warning" size="small" icon={<PendingIcon />} />;
      case "in-progress":
        return <Chip label="In Progress" color="info" size="small" icon={<AccessTimeIcon />} />;
      case "completed":
        return <Chip label="Completed" color="primary" size="small" icon={<DoneAllIcon />} />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" icon={<Cancel />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getPaymentStatusChip = (status) => {
    switch (status) {
      case "paid":
        return <Chip label="Paid" color="success" size="small" />;
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />;
      case "failed":
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Define cell components with proper prop types
  const UserCell = ({ value }) => (
    <Box>
      <MDTypography variant="caption" fontWeight="medium">
        {value?.name || "N/A"}
      </MDTypography>
      <MDTypography variant="caption" display="block">
        {value?.phoneNumber || "N/A"}
      </MDTypography>
    </Box>
  );

  UserCell.propTypes = {
    value: PropTypes.shape({
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
  };

  const AddressCell = ({ value }) => (
    <MDTypography variant="caption" noWrap sx={{ maxWidth: "150px" }}>
      {value}
    </MDTypography>
  );

  AddressCell.propTypes = {
    value: PropTypes.string,
  };

  const AmountCell = ({ value }) => `$${value}`;

  AmountCell.propTypes = {
    value: PropTypes.string,
  };

  const StatusCell = ({ value }) => getStatusChip(value);

  StatusCell.propTypes = {
    value: PropTypes.string,
  };

  const PaymentStatusCell = ({ value }) => getPaymentStatusChip(value);

  PaymentStatusCell.propTypes = {
    value: PropTypes.string,
  };

  const columns = [
    { Header: "Ride ID", accessor: "rideId" },
    {
      Header: "User",
      accessor: "User",
      Cell: UserCell,
    },
    {
      Header: "Pickup",
      accessor: "pickupAddress",
      Cell: AddressCell,
    },
    {
      Header: "Drop",
      accessor: "dropAddress",
      Cell: AddressCell,
    },
    {
      Header: "Date & Time",
      accessor: (row) => `${row.date} ${row.time}`,
    },
    {
      Header: "Amount",
      accessor: "totalAmount",
      Cell: AmountCell,
    },
    {
      Header: "Payment",
      accessor: "paymentStatus",
      Cell: PaymentStatusCell,
    },
    {
      Header: "Status",
      accessor: "rideStatus",
      Cell: StatusCell,
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
              <IconButton onClick={() => handleViewRide(row.original)}>
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
              <MenuItem onClick={() => handleOpenStatusDialog(row.original)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Update Status</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];

  const filteredRides = rides.filter((ride) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (ride.rideId && ride.rideId.toLowerCase().includes(searchTermLower)) ||
      (ride.User?.name && ride.User.name.toLowerCase().includes(searchTermLower)) ||
      (ride.User?.phoneNumber && ride.User.phoneNumber.toLowerCase().includes(searchTermLower)) ||
      (ride.pickupAddress && ride.pickupAddress.toLowerCase().includes(searchTermLower)) ||
      (ride.dropAddress && ride.dropAddress.toLowerCase().includes(searchTermLower))
    );
  });

  // Apply pagination
  const paginatedRides = filteredRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                    Rides
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                        sx={{
                          width: 200,
                          height: 35,
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search rides"
                      type="text"
                      fullWidth
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
                  table={{ columns, rows: paginatedRides }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredRides.length}
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

      {/* Ride Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Ride Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewRideData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Ride ID:</strong> {viewRideData.rideId}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewRideData.rideStatus)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Date:</strong> {viewRideData.date}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Time:</strong> {viewRideData.time}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Duration:</strong> {viewRideData.duration} minutes
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Total Amount:</strong> ${viewRideData.totalAmount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Payment Type:</strong> {viewRideData.paymentType}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Payment Status:</strong>{" "}
                      {getPaymentStatusChip(viewRideData.paymentStatus)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewRideData.createdAt).toLocaleString()}
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
                      <strong>Name:</strong> {viewRideData.User?.name || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Phone:</strong> {viewRideData.User?.phoneNumber || "N/A"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Ride Details
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Pickup Address:</strong> {viewRideData.pickupAddress}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Drop Address:</strong> {viewRideData.dropAddress}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Number of People:</strong> {viewRideData.numberOfPeople}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Has Pets:</strong> {viewRideData.hasPets ? "Yes" : "No"}
                    </MDTypography>
                  </Grid>
                  {viewRideData.hasPets && (
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Number of Pets:</strong> {viewRideData.numberOfPets}
                      </MDTypography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Special Requests:</strong> {viewRideData.specialRequests || "None"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              {viewRideData.cancellationReason && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Cancellation Details
                    </MDTypography>
                    <MDTypography>
                      <strong>Reason:</strong> {viewRideData.cancellationReason}
                    </MDTypography>
                  </MDBox>
                </>
              )}

              {viewRideData.rating && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Feedback
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Rating:</strong> {viewRideData.rating}/5
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Review:</strong> {viewRideData.review || "None"}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                </>
              )}
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Ride Status</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                label="Status"
                sx={{
                  width: 300,
                  height: 35,
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} color="error" variant="contained">
            Update Status
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

Rides.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      rideId: PropTypes.string.isRequired,
      User: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        phoneNumber: PropTypes.string,
      }),
      pickupAddress: PropTypes.string.isRequired,
      dropAddress: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      numberOfPeople: PropTypes.number.isRequired,
      hasPets: PropTypes.bool.isRequired,
      numberOfPets: PropTypes.number,
      specialRequests: PropTypes.string,
      duration: PropTypes.number.isRequired,
      totalAmount: PropTypes.string.isRequired,
      paymentType: PropTypes.string.isRequired,
      paymentStatus: PropTypes.string.isRequired,
      rideStatus: PropTypes.string.isRequired,
      cancellationReason: PropTypes.string,
      rating: PropTypes.number,
      review: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Rides;
