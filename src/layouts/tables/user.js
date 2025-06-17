import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Chip,
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
  Avatar,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  DialogContentText,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CollectionsIcon from "@mui/icons-material/Collections";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://business-branding.synoventum.site";

const DURATION_OPTIONS = [
  { value: "1 month", label: "1 Month" },
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "1 year", label: "1 Year" },
];

function Users() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewUserData, setViewUserData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusData, setStatusData] = useState({
    id: null,
    status: "active",
    duration: "3 months",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    mobile_number: "",
    email: "",
    password: "",
    validation_key: "",
    profile_image: "",
    employeeid: "",
    username: "",
  });
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (openCreateDialog) {
      fetchEmployees();
    }
  }, [openCreateDialog]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const result = await response.json();

      if (!result.employees || !Array.isArray(result.employees)) {
        throw new Error("Invalid data structure from API");
      }

      setEmployees(result.employees);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      showSnackbar(error.message || "Error fetching employees", "error");
    } finally {
      setLoadingEmployees(false);
    }
  };

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

      const result = await response.json();

      if (!result.status || !result.data || !Array.isArray(result.data.users)) {
        throw new Error("Invalid data structure from API");
      }

      setUsers(result.data.users);
      setTotalUsers(result.data.total || result.data.users.length);
      setTotalPages(result.data.totalPages || Math.ceil(result.data.users.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar(error.message || "Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return null;
      }

      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch(`${BASE_URL}/api/upload/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return data.files[0].filename;
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(error.message || "Error uploading file", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleViewUser = (user) => {
    setViewUserData(user);
    setOpenViewDialog(true);
  };

  const handleOpenStatusDialog = (user) => {
    setStatusData({
      id: user.id,
      status: user.status,
      duration: "3 months",
    });
    setOpenStatusDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
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
          duration: statusData.duration,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to update user status");
      }

      showSnackbar("User status updated successfully");
      setOpenStatusDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      showSnackbar(error.message || "Error updating user status", "error");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      if (!deleteId) {
        showSnackbar("No user selected for deletion", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to delete user");
      }

      showSnackbar("User deleted successfully");
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar(error.message || "Error deleting user", "error");
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();

      if (!result.message || !result.user) {
        throw new Error("Invalid response from server");
      }

      showSnackbar("User created successfully");
      setOpenCreateDialog(false);
      setNewUser({
        mobile_number: "",
        email: "",
        password: "",
        validation_key: "",
        profile_image: "",
        employeeid: "",
        username: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      showSnackbar(error.message || "Error creating user", "error");
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

  const ImageCell = ({ value }) => {
    if (!value) return <MDTypography variant="caption">No Image</MDTypography>;

    return (
      <Avatar
        src={`${BASE_URL}/uploads/${value}`}
        variant="rounded"
        sx={{ width: 40, height: 40 }}
        style={{ cursor: "pointer" }}
      />
    );
  };

  ImageCell.propTypes = {
    value: PropTypes.string,
  };

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
      (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
      user.mobile_number.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      (user.employeeid && user.employeeid.toLowerCase().includes(searchTermLower)) ||
      user.id.toString().includes(searchTermLower)
    );
  });

  const ActionsCell = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <IconButton
          aria-label="more"
          aria-controls={`actions-menu-${row.id}`}
          aria-haspopup="true"
          onClick={handleMenuOpen}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`actions-menu-${row.id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleViewUser(row.original);
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleOpenStatusDialog(row.original);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Update Status" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleOpenDeleteDialog(row.original.id);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </>
    );
  };

  ActionsCell.propTypes = {
    row: PropTypes.object.isRequired,
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Username", accessor: "username" },
    { Header: "Mobile", accessor: "mobile_number" },
    { Header: "Email", accessor: "email" },
    {
      Header: "Profile",
      accessor: "profile_image",
      Cell: ImageCell,
    },
    {
      Header: "Employee ID",
      accessor: "employeeid",
      Cell: ({ value }) => value || "N/A",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ActionsCell,
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.05)",
                border: "none",
                overflow: "visible",
              }}
            >
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                borderRadius="lg"
                sx={{
                  background: "linear-gradient(87deg, #5e72e4 0, #825ee4 100%)",
                  boxShadow:
                    "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(94, 114, 228, 0.4)",
                }}
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <MDTypography
                    variant="h6"
                    color="#fff"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Users Management
                  </MDTypography>
                  <Box display="flex" gap={2}>
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
                        "& .MuiInputBase-input": {
                          color: "#fff",
                          "&::placeholder": {
                            color: "rgba(255,255,255,0.7)",
                            opacity: 1,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255,255,255,0.7)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255,255,255,0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.75)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#fff",
                          },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={handleOpenCreateDialog}
                      sx={{
                        background: "linear-gradient(87deg, #2dce89 0, #2dcecc 100%)",
                        "&:hover": {
                          background: "linear-gradient(87deg, #2dce89 0, #2dcecc 100%)",
                        },
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      Add User
                    </Button>
                  </Box>
                </MDBox>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{ columns, rows: filteredUsers }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  sx={{
                    "& .MuiTableRow-root": {
                      transition: "background-color 0.2s ease",
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(94, 114, 228, 0.05)",
                      },
                    },
                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      padding: "12px 16px",
                    },
                    "& .MuiTableHead-root": {
                      "& .MuiTableCell-root": {
                        backgroundColor: "#f7fafc",
                        color: "#32325d",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid rgba(0,0,0,0.05)",
                      },
                    },
                  }}
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={totalUsers}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                      color: "#525f7f",
                      fontSize: "0.875rem",
                    },
                  }}
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
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(87deg, #5e72e4 0, #825ee4 100%)",
            color: "#fff",
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" color="#fff">
            User Details
          </MDTypography>
          <IconButton
            onClick={() => setOpenViewDialog(false)}
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#f7fafc" }}>
          {viewUserData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#5e72e4",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                  Basic Information
                </MDTypography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewUserData.id}
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
                      {new Date(viewUserData.created_at).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Updated At:</strong>{" "}
                      {new Date(viewUserData.updated_at).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Profile Image:</strong>
                    </MDTypography>
                    {viewUserData.profile_image ? (
                      <Avatar
                        src={`${BASE_URL}/uploads/${viewUserData.profile_image}`}
                        variant="rounded"
                        sx={{ width: 100, height: 100, mt: 1 }}
                      />
                    ) : (
                      <MDTypography variant="caption">No profile image available</MDTypography>
                    )}
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox mb={3}>
                <Divider sx={{ my: 2 }} />
                <MDTypography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#5e72e4",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PhoneIcon fontSize="small" />
                  Contact Information
                </MDTypography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Username:</strong> {viewUserData.username || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Mobile Number:</strong> {viewUserData.mobile_number}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Email:</strong> {viewUserData.email}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Validation Key:</strong> {viewUserData.validation_key}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Employee ID:</strong> {viewUserData.employeeid || "N/A"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox mb={3}>
                <Divider sx={{ my: 2 }} />
                <MDTypography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#5e72e4",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarTodayIcon fontSize="small" />
                  Subscription Information
                </MDTypography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Starting Date:</strong>{" "}
                      {viewUserData.starting_date
                        ? new Date(viewUserData.starting_date).toLocaleDateString()
                        : "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Ending Date:</strong>{" "}
                      {viewUserData.ending_date
                        ? new Date(viewUserData.ending_date).toLocaleDateString()
                        : "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Payment Amount:</strong> {viewUserData.paymentAmount || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Payment Mode:</strong> {viewUserData.paymentMode || "N/A"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f7fafc", padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenViewDialog(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              "&:hover": {
                background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              },
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
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
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
            color: "#fff",
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Update User Status
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7fafc" }}>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusData.status}
                    onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                    label="Status"
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {statusData.status === "active" && (
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={statusData.duration}
                      onChange={(e) => setStatusData({ ...statusData, duration: e.target.value })}
                      label="Duration"
                      required
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f7fafc", padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenStatusDialog(false)}
            sx={{
              color: "#525f7f",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "8px 24px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            color="error"
            variant="contained"
            sx={{
              background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              "&:hover": {
                background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              },
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ml: 2,
            }}
          >
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
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(87deg, #fb6340 0, #fbb140 100%)",
            color: "#fff",
            padding: "16px 24px",
            fontWeight: "bold",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7fafc" }}>
          <MDBox mt={2} mb={3}>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f7fafc", padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: "#525f7f",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "8px 24px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            sx={{
              background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              "&:hover": {
                background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              },
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ml: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(87deg, #2dce89 0, #2dcecc 100%)",
            color: "#fff",
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Create New User
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7fafc" }}>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Username"
                  fullWidth
                  margin="normal"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  margin="normal"
                  value={newUser.mobile_number}
                  onChange={(e) => setNewUser({ ...newUser, mobile_number: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Validation Key"
                  fullWidth
                  margin="normal"
                  value={newUser.validation_key}
                  onChange={(e) => setNewUser({ ...newUser, validation_key: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Employee ID</InputLabel>
                  <Select
                    value={newUser.employeeid}
                    onChange={(e) => setNewUser({ ...newUser, employeeid: e.target.value })}
                    label="Employee ID"
                    disabled={loadingEmployees}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.employeeid}>
                        {employee.employeeid} - {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingEmployees && (
                    <Box display="flex" justifyContent="center" mt={1}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="create-user-upload"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const filename = await handleFileUpload(file);
                      if (filename) {
                        setNewUser({ ...newUser, profile_image: filename });
                      }
                    }
                  }}
                />
                <label htmlFor="create-user-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CollectionsIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Profile Image
                  </Button>
                </label>
                {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                {newUser.profile_image && (
                  <Box mt={2}>
                    <MDTypography variant="caption">Image selected</MDTypography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      <Avatar
                        src={`${BASE_URL}/uploads/${newUser.profile_image}`}
                        variant="rounded"
                        sx={{ width: 80, height: 80 }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
                          },
                        }}
                        onClick={() => {
                          setNewUser({ ...newUser, profile_image: "" });
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f7fafc", padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              color: "#525f7f",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "8px 24px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            color="error"
            variant="contained"
            sx={{
              background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              "&:hover": {
                background: "linear-gradient(87deg, #f5365c 0, #f5365c 100%)",
              },
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ml: 2,
            }}
          >
            Create User
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <CloseIcon fontSize="inherit" />,
            warning: <CloseIcon fontSize="inherit" />,
            info: <CloseIcon fontSize="inherit" />,
          }}
        >
          <MDTypography variant="body2" fontWeight="medium">
            {snackbar.message}
          </MDTypography>
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Users;
