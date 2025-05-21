import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Disputes() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("payment");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewDisputeData, setViewDisputeData] = useState(null);
  const [openResolveDialog, setOpenResolveDialog] = useState(false);
  const [resolveData, setResolveData] = useState({
    id: null,
    status: "resolved",
    resolution: "",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter, typeFilter, startDate, endDate]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      let url = `${BASE_URL}/v1/admin/disputes?status=${statusFilter}&type=${typeFilter}`;

      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      if (endDate) {
        url += `&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch disputes");
      }

      const data = await response.json();
      setDisputes(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching dispute data:", error);
      showSnackbar("Error fetching disputes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDispute = (dispute) => {
    setViewDisputeData(dispute);
    setOpenViewDialog(true);
  };

  const handleOpenResolveDialog = (dispute) => {
    setResolveData({
      id: dispute.id,
      status: "resolved",
      resolution: "",
    });
    setOpenResolveDialog(true);
  };

  const handleResolveDispute = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/disputes/${resolveData.id}/resolve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: resolveData.status,
          resolution: resolveData.resolution,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve dispute");
      }

      showSnackbar("Dispute resolved successfully");
      setOpenResolveDialog(false);
      fetchDisputes();
    } catch (error) {
      console.error("Error resolving dispute:", error);
      showSnackbar(error.message || "Error resolving dispute", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "resolved":
        return <Chip label="Resolved" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" icon={<CancelIcon />} />;
      case "pending":
        return <Chip label="Pending" color="warning" size="small" icon={<PendingIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getTypeChip = (type) => {
    switch (type) {
      case "payment":
        return <Chip label="Payment" color="primary" size="small" />;
      case "service":
        return <Chip label="Service" color="secondary" size="small" />;
      case "other":
        return <Chip label="Other" color="info" size="small" />;
      default:
        return <Chip label={type} size="small" />;
    }
  };

  const DateCell = ({ value }) => new Date(value).toLocaleDateString();
  DateCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "User", accessor: "user.name" },
    { Header: "Ride ID", accessor: "ride_id" },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => getTypeChip(value),
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) => `$${value}`,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: DateCell,
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
              <IconButton onClick={() => handleViewDispute(row.original)}>
                <VisibilityIcon color="info" />
              </IconButton>
            </Tooltip>
            {row.original.status === "pending" && (
              <>
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
                  <MenuItem onClick={() => handleOpenResolveDialog(row.original)}>
                    <ListItemIcon>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText>Resolve</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  const filteredDisputes = disputes.filter((dispute) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      dispute.id.toString().includes(searchTermLower) ||
      (dispute.user &&
        dispute.user.name &&
        dispute.user.name.toLowerCase().includes(searchTermLower)) ||
      dispute.ride_id.toString().includes(searchTermLower) ||
      (dispute.reason && dispute.reason.toLowerCase().includes(searchTermLower))
    );
  });

  // Apply pagination
  const paginatedDisputes = filteredDisputes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                    Disputes
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="payment">Payment</MenuItem>
                        <MenuItem value="service">Service</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      sx={{ width: 150 }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      sx={{ width: 150 }}
                    />
                    <TextField
                      label="Search disputes"
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
                  table={{ columns, rows: paginatedDisputes }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredDisputes.length}
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

      {/* Dispute Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Dispute Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewDisputeData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewDisputeData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>User:</strong> {viewDisputeData.user?.name || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Ride ID:</strong> {viewDisputeData.ride_id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Type:</strong> {getTypeChip(viewDisputeData.type)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Amount:</strong> ${viewDisputeData.amount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewDisputeData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Reason:</strong> {viewDisputeData.reason || "N/A"}
                    </MDTypography>
                  </Grid>
                  {viewDisputeData.resolution && (
                    <Grid item xs={12}>
                      <MDTypography>
                        <strong>Resolution:</strong> {viewDisputeData.resolution}
                      </MDTypography>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewDisputeData.created_at).toLocaleString()}
                    </MDTypography>
                  </Grid>
                  {viewDisputeData.updated_at && (
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Updated At:</strong>{" "}
                        {new Date(viewDisputeData.updated_at).toLocaleString()}
                      </MDTypography>
                    </Grid>
                  )}
                </Grid>
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

      {/* Resolve Dispute Dialog */}
      <Dialog
        open={openResolveDialog}
        onClose={() => setOpenResolveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Resolve Dispute</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={resolveData.status}
                onChange={(e) => setResolveData({ ...resolveData, status: e.target.value })}
                label="Status"
                sx={{ width: 300, height: 40 }}
              >
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Resolution Notes"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={resolveData.resolution}
              onChange={(e) => setResolveData({ ...resolveData, resolution: e.target.value })}
              required
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResolveDialog(false)}>Cancel</Button>
          <Button onClick={handleResolveDispute} color="error" variant="contained">
            Submit Resolution
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

Disputes.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string,
      }),
      ride_id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      reason: PropTypes.string,
      resolution: PropTypes.string,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Disputes;
