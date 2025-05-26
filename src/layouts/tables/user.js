import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://business-branding.synoventum.site";

function Users() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusData, setStatusData] = useState({
    id: null,
    status: "active",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

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

      const response = await fetch(
        `${BASE_URL}/api/admin/users?page=${page + 1}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data.users);
      setTotalUsers(data.data.total);
      setTotalPages(data.data.totalPages);
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

      const response = await fetch(`${BASE_URL}/api/admin/users/${statusData.id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" />;
      case "inactive":
        return <Chip label="Inactive" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const handleViewImage = (imageUrl) => {
    if (!imageUrl) return;
    setImageLoading(true);
    setCurrentImage(`${BASE_URL}/uploads/${imageUrl}`);
    setOpenImageDialog(true);
  };

  const handleDownloadImage = (imageUrl) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = `${BASE_URL}/uploads/${imageUrl}`;
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
          src={`${BASE_URL}/uploads/${imageUrl}`}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
          onClick={() => handleViewImage(imageUrl)}
          style={{ cursor: "pointer" }}
        />
        <Box>
          <IconButton onClick={() => handleViewImage(imageUrl)} size="small">
            <VisibilityIcon color="primary" />
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

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
      (user.mobile_number && user.mobile_number.toLowerCase().includes(searchTermLower))
    );
  });

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Email", accessor: "email", Cell: ({ value }) => value || "N/A" },
    { Header: "Mobile Number", accessor: "mobile_number" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Profile Image",
      accessor: "profile_image",
      Cell: ({ value }) => renderImageWithPreview(value),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => new Date(value).toLocaleString(),
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
            </Menu>
          </Box>
        );
      },
    },
  ];

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
                    Users Management
                  </MDTypography>
                  <Box>
                    <TextField
                      label="Search users"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        width: 300,
                        [theme.breakpoints.down("sm")]: {
                          width: "100%",
                          marginBottom: 2,
                        },
                      }}
                    />
                  </Box>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: filteredUsers }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={totalUsers}
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
            <MDTypography variant="h5">User Details</MDTypography>
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
                      <strong>ID:</strong> {viewUserData.id}
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
                      <strong>Status:</strong> {getStatusChip(viewUserData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewUserData.created_at).toLocaleString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Updated At:</strong>{" "}
                      {new Date(viewUserData.updated_at).toLocaleString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Profile Image:</strong>
                    </MDTypography>
                    {renderImageWithPreview(viewUserData.profile_image)}
                  </Grid>
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
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
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
            onClick={() => handleDownloadImage(currentImage.replace(`${BASE_URL}/uploads/`, ""))}
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
      email: PropTypes.string,
      mobile_number: PropTypes.string.isRequired,
      status: PropTypes.string,
      profile_image: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Users;
