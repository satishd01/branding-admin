import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Chip,
  CardMedia,
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
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Users() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("user");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewUserData, setViewUserData] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [openKycDialog, setOpenKycDialog] = useState(false);
  const [kycData, setKycData] = useState({
    id: null,
    verificationStatus: "pending",
    remarks: "",
  });
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusData, setStatusData] = useState({
    id: null,
    status: "active",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/data?type=${userType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setViewUserData(user);
    setOpenViewDialog(true);
  };

  const handleOpenKycDialog = (user) => {
    setKycData({
      id: user.id,
      verificationStatus: user.kycStatus || "pending",
      remarks: "",
    });
    setOpenKycDialog(true);
  };

  const handleUpdateKyc = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/verify-kyc`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: userType,
          id: kycData.id,
          verificationStatus: kycData.verificationStatus,
          remarks: kycData.remarks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update KYC status");
      }

      const data = await response.json();
      showSnackbar("KYC status updated successfully");
      setOpenKycDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating KYC status:", error);
      showSnackbar(error.message || "Error updating KYC status", "error");
    }
  };

  const handleOpenStatusDialog = (user) => {
    setStatusData({
      id: user.id,
      status: user.status || "active",
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

      const response = await fetch(`${BASE_URL}/v1/admin/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: userType,
          id: statusData.id,
          status: statusData.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      showSnackbar("Status updated successfully");
      setOpenStatusDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar(error.message || "Error updating status", "error");
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: userType,
          id: deleteId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showSnackbar("User deleted successfully");
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar(error.message || "Error deleting user", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" />;
      case "suspend":
        return <Chip label="Suspended" color="warning" size="small" />;
      case "block":
        return <Chip label="Blocked" color="error" size="small" />;
      case "deleted":
        return <Chip label="Deleted" color="error" size="small" variant="outlined" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const getKycStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Chip label="Approved" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" icon={<CancelIcon />} />;
      default:
        return <Chip label="Pending" color="warning" size="small" icon={<PendingIcon />} />;
    }
  };

  const handleViewImage = (imageUrl) => {
    if (!imageUrl) return;
    setImageLoading(true);
    setCurrentImage(`${BASE_URL}/${imageUrl}`);
    setOpenImageDialog(true);
  };

  const handleDownloadImage = (imageUrl) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = `${BASE_URL}/${imageUrl}`;
    link.target = "_blank";
    link.download = imageUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderImageWithPreview = (imageUrl, altText = "Image") => {
    if (!imageUrl) return <MDTypography variant="caption">Not Available</MDTypography>;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={`${BASE_URL}/${imageUrl}`}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
          onClick={() => handleViewImage(imageUrl)}
          style={{ cursor: "pointer" }}
        />
        <Box>
          <IconButton onClick={() => handleViewImage(imageUrl)} size="small">
            <ImageIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDownloadImage(imageUrl)} size="small">
            <DownloadIcon color="primary" />
          </IconButton>
        </Box>
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

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name", Cell: ({ value }) => value || "N/A" },
    // { Header: "Email", accessor: "email", Cell: ({ value }) => value || "N/A" },
    { Header: "Mobile Number", accessor: "mobileNumber" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "KYC Status",
      accessor: "kycStatus",
      Cell: ({ value }) => getKycStatusChip(value),
    },
    {
      Header: "Terms Accepted",
      accessor: "terms_accepted",
      Cell: ({ value }) => (value ? "Yes" : "No"),
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
              <IconButton onClick={() => handleViewUser(row.original)}>
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
              <MenuItem onClick={() => handleOpenKycDialog(row.original)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Update KYC</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleOpenStatusDialog(row.original)}>
                <ListItemIcon>
                  {row.original.status === "active" ? (
                    <BlockIcon fontSize="small" color="warning" />
                  ) : (
                    <LockOpenIcon fontSize="small" color="success" />
                  )}
                </ListItemIcon>
                <ListItemText>Update Status</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleOpenDeleteDialog(row.original.id)}>
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

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
      (user.mobile_number && user.mobile_number.toLowerCase().includes(searchTermLower))
    );
  });

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                    {userType === "host" ? "Hosts" : "Users"}
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>User Type</InputLabel>
                      <Select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        label="User Type"
                        sx={{
                          width: 200,
                          height: 35,
                        }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="host">Host</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label={`Search ${userType === "host" ? "hosts" : "users"}`}
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
                  table={{ columns, rows: paginatedUsers }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredUsers.length}
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

      {/* User Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">
              {userType === "host" ? "Host" : "User"} Details
            </MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewUserData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewUserData.name || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Email:</strong> {viewUserData.email || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Mobile:</strong> {viewUserData.mobile_number}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Verified:</strong> {viewUserData.isVerified ? "Yes" : "No"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewUserData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>KYC Status:</strong> {getKycStatusChip(viewUserData.kycStatus)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Terms Accepted:</strong> {viewUserData.terms_accepted ? "Yes" : "No"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewUserData.createdAt).toLocaleString()}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              {userType === "host" && viewUserData.businessInfo && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Business Information
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Owner Name:</strong> {viewUserData.businessInfo.owner_full_name}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Restaurant Name:</strong>{" "}
                          {viewUserData.businessInfo.restaurant_name}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Business Type:</strong> {viewUserData.businessInfo.business_type}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Business Registration Number:</strong>{" "}
                          {viewUserData.businessInfo.business_registration_number}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12}>
                        <MDTypography>
                          <strong>Business Address:</strong>{" "}
                          {viewUserData.businessInfo.business_address}
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

      {/* KYC Update Dialog */}
      <Dialog open={openKycDialog} onClose={() => setOpenKycDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update KYC Status</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Verification Status</InputLabel>
              <Select
                value={kycData.verificationStatus}
                onChange={(e) => setKycData({ ...kycData, verificationStatus: e.target.value })}
                label="Verification Status"
                sx={{
                  width: 200,
                  height: 35,
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Remarks"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={kycData.remarks}
              onChange={(e) => setKycData({ ...kycData, remarks: e.target.value })}
              placeholder="Enter remarks for KYC verification"
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKycDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateKyc} color="error" variant="contained">
            Update KYC
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
        <DialogTitle>Update User Status</DialogTitle>
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspend">Suspend</MenuItem>
                <MenuItem value="block">Block</MenuItem>
                <MenuItem value="deleted">Delete</MenuItem>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <MDTypography>
              Are you sure you want to delete this {userType}? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6">Image Preview</MDTypography>
            <IconButton onClick={() => setOpenImageDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          {imageLoading && (
            <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </MDBox>
          )}
          <CardMedia
            component="img"
            image={currentImage}
            alt="Preview"
            sx={{
              maxHeight: "70vh",
              objectFit: "contain",
              display: imageLoading ? "none" : "block",
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDownloadImage(currentImage.replace(BASE_URL + "/", ""))}
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Download
          </Button>
          <Button onClick={() => setOpenImageDialog(false)} variant="contained" color="error">
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

Users.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      mobile_number: PropTypes.string.isRequired,
      isVerified: PropTypes.number,
      kycStatus: PropTypes.string,
      status: PropTypes.string,
      terms_accepted: PropTypes.number,
      onboarding_completed: PropTypes.number,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Users;
