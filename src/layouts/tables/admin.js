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
  Avatar,
  Checkbox,
  FormControlLabel,
  Switch,
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
import PersonIcon from "@mui/icons-material/Person";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function AdminUsers() {
  const theme = useTheme();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewAdminData, setViewAdminData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    email: "",
    name: "",
    role: "admin",
    isActive: true,
    permissions: {
      analytics: false,
      ride_analytics: false,
      dynamic_pricing: false,
      ride_management: false,
      user_management: false,
      dispute_management: false,
      promotion_management: false,
    },
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin",
    isActive: true,
    permissions: {
      analytics: false,
      ride_analytics: false,
      dynamic_pricing: false,
      ride_management: false,
      user_management: false,
      dispute_management: false,
      promotion_management: false,
    },
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAdmins();
  }, [roleFilter, statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/getAdmins`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching admin data:", error);
      showSnackbar("Error fetching admins", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/getAdmins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin details");
      }

      const data = await response.json();
      setViewAdminData(data.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching admin details:", error);
      showSnackbar("Error fetching admin details", "error");
    }
  };

  const handleViewAdmin = (admin) => {
    fetchAdminById(admin.id);
  };

  const handleOpenEditDialog = (admin) => {
    setEditData({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      permissions: admin.permissions || {
        analytics: false,
        ride_analytics: false,
        dynamic_pricing: false,
        ride_management: false,
        user_management: false,
        dispute_management: false,
        promotion_management: false,
      },
    });
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setNewAdmin({
      email: "",
      password: "",
      name: "",
      role: "admin",
      isActive: true,
      permissions: {
        analytics: false,
        ride_analytics: false,
        dynamic_pricing: false,
        ride_management: false,
        user_management: false,
        dispute_management: false,
        promotion_management: false,
      },
    });
    setOpenCreateDialog(true);
  };

  const handleUpdateAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/updateAdmin/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editData.email,
          name: editData.name,
          role: editData.role,
          isActive: editData.isActive,
          permissions: editData.permissions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update admin");
      }

      showSnackbar("Admin updated successfully");
      setOpenEditDialog(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      showSnackbar(error.message || "Error updating admin", "error");
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/deleteAdmin/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete admin");
      }

      showSnackbar("Admin deleted successfully");
      setOpenDeleteDialog(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      showSnackbar(error.message || "Error deleting admin", "error");
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/addAdmin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        throw new Error("Failed to create admin");
      }

      showSnackbar("Admin created successfully");
      setOpenCreateDialog(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error creating admin:", error);
      showSnackbar(error.message || "Error creating admin", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusChip = (status) => {
    return status ? (
      <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon />} />
    ) : (
      <Chip label="Inactive" color="error" size="small" icon={<CancelIcon />} />
    );
  };

  const getRoleChip = (role) => {
    switch (role) {
      case "superUser":
        return <Chip label="Super Admin" color="primary" size="small" />;
      case "admin":
        return <Chip label="Admin" color="secondary" size="small" />;
      default:
        return <Chip label={role} size="small" />;
    }
  };

  const handlePermissionChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditData({
        ...editData,
        permissions: {
          ...editData.permissions,
          [field]: value,
        },
      });
    } else {
      setNewAdmin({
        ...newAdmin,
        permissions: {
          ...newAdmin.permissions,
          [field]: value,
        },
      });
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
      Header: "Admin",
      accessor: (row) => ({ name: row.name, email: row.email }),
      Cell: UserCell,
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }) => getRoleChip(value),
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Last Login",
      accessor: (row) => formatDate(row.lastLogin),
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
              <IconButton onClick={() => handleViewAdmin(row.original)}>
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
              <MenuItem onClick={() => handleOpenEditDialog(row.original)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
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

  const filteredAdmins = Array.isArray(admins)
    ? admins.filter((admin) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (admin.id && admin.id.toString().includes(searchTermLower)) ||
          (admin.name && admin.name.toLowerCase().includes(searchTermLower)) ||
          (admin.email && admin.email.toLowerCase().includes(searchTermLower))
        );
      })
    : [];

  // Apply pagination
  const paginatedAdmins = filteredAdmins.slice(
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
                    Admin Users Management
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        label="Role"
                        sx={{
                          width: 150,
                          height: 35,
                        }}
                      >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="superUser">Super Admin</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                        sx={{
                          width: 150,
                          height: 35,
                        }}
                      >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search admins"
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
                      Add Admin
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedAdmins }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredAdmins.length}
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

      {/* Admin Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Admin Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewAdminData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewAdminData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewAdminData.name}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Email:</strong> {viewAdminData.email}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Role:</strong> {getRoleChip(viewAdminData.role)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewAdminData.isActive)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Last Login:</strong> {formatDate(viewAdminData.lastLogin)}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Permissions
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.analytics || false}
                          disabled
                        />
                      }
                      label="Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.ride_analytics || false}
                          disabled
                        />
                      }
                      label="Ride Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.dynamic_pricing || false}
                          disabled
                        />
                      }
                      label="Dynamic Pricing"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.ride_management || false}
                          disabled
                        />
                      }
                      label="Ride Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.user_management || false}
                          disabled
                        />
                      }
                      label="User Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.dispute_management || false}
                          disabled
                        />
                      }
                      label="Dispute Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={viewAdminData.permissions?.promotion_management || false}
                          disabled
                        />
                      }
                      label="Promotion Management"
                    />
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

      {/* Edit Admin Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Edit Admin</MDTypography>
            <IconButton onClick={() => setOpenEditDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    label="Role"
                    required
                  >
                    <MenuItem value="superUser">Super Admin</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.isActive}
                      onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Permissions
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.analytics}
                          onChange={(e) =>
                            handlePermissionChange("analytics", e.target.checked, true)
                          }
                        />
                      }
                      label="Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.ride_analytics}
                          onChange={(e) =>
                            handlePermissionChange("ride_analytics", e.target.checked, true)
                          }
                        />
                      }
                      label="Ride Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.dynamic_pricing}
                          onChange={(e) =>
                            handlePermissionChange("dynamic_pricing", e.target.checked, true)
                          }
                        />
                      }
                      label="Dynamic Pricing"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.ride_management}
                          onChange={(e) =>
                            handlePermissionChange("ride_management", e.target.checked, true)
                          }
                        />
                      }
                      label="Ride Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.user_management}
                          onChange={(e) =>
                            handlePermissionChange("user_management", e.target.checked, true)
                          }
                        />
                      }
                      label="User Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.dispute_management}
                          onChange={(e) =>
                            handlePermissionChange("dispute_management", e.target.checked, true)
                          }
                        />
                      }
                      label="Dispute Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editData.permissions.promotion_management}
                          onChange={(e) =>
                            handlePermissionChange("promotion_management", e.target.checked, true)
                          }
                        />
                      }
                      label="Promotion Management"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateAdmin} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Admin</MDTypography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    label="Role"
                    required
                  >
                    <MenuItem value="superUser">Super Admin</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newAdmin.isActive}
                      onChange={(e) => setNewAdmin({ ...newAdmin, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Permissions
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.analytics}
                          onChange={(e) => handlePermissionChange("analytics", e.target.checked)}
                        />
                      }
                      label="Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.ride_analytics}
                          onChange={(e) =>
                            handlePermissionChange("ride_analytics", e.target.checked)
                          }
                        />
                      }
                      label="Ride Analytics"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.dynamic_pricing}
                          onChange={(e) =>
                            handlePermissionChange("dynamic_pricing", e.target.checked)
                          }
                        />
                      }
                      label="Dynamic Pricing"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.ride_management}
                          onChange={(e) =>
                            handlePermissionChange("ride_management", e.target.checked)
                          }
                        />
                      }
                      label="Ride Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.user_management}
                          onChange={(e) =>
                            handlePermissionChange("user_management", e.target.checked)
                          }
                        />
                      }
                      label="User Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.dispute_management}
                          onChange={(e) =>
                            handlePermissionChange("dispute_management", e.target.checked)
                          }
                        />
                      }
                      label="Dispute Management"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newAdmin.permissions.promotion_management}
                          onChange={(e) =>
                            handlePermissionChange("promotion_management", e.target.checked)
                          }
                        />
                      }
                      label="Promotion Management"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAdmin} color="primary" variant="contained">
            Create Admin
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
              Are you sure you want to delete this admin? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAdmin} color="error" variant="contained">
            Delete
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

AdminUsers.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      lastLogin: PropTypes.string,
      permissions: PropTypes.shape({
        analytics: PropTypes.bool,
        ride_analytics: PropTypes.bool,
        dynamic_pricing: PropTypes.bool,
        ride_management: PropTypes.bool,
        user_management: PropTypes.bool,
        dispute_management: PropTypes.bool,
        promotion_management: PropTypes.bool,
      }),
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AdminUsers;
