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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Promotions() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewPromotionData, setViewPromotionData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    status: "active",
    endDate: "",
    maxDiscount: "",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minRideAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    userType: "new",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPromotions();
  }, [statusFilter, typeFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      let url = `${BASE_URL}/v1/admin/promotions?status=${statusFilter}`;
      if (typeFilter !== "all") {
        url += `&type=${typeFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch promotions");
      }

      const data = await response.json();
      setPromotions(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching promotion data:", error);
      showSnackbar("Error fetching promotions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPromotion = (promotion) => {
    setViewPromotionData(promotion);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (promotion) => {
    setEditData({
      id: promotion.id,
      status: promotion.status,
      endDate: promotion.endDate.split("T")[0],
      maxDiscount: promotion.maxDiscount,
    });
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleUpdatePromotion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/promotions/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editData.status,
          endDate: editData.endDate ? `${editData.endDate}T23:59:59Z` : null,
          maxDiscount: editData.maxDiscount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update promotion");
      }

      showSnackbar("Promotion updated successfully");
      setOpenEditDialog(false);
      fetchPromotions();
    } catch (error) {
      console.error("Error updating promotion:", error);
      showSnackbar(error.message || "Error updating promotion", "error");
    }
  };

  const handleDeletePromotion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/promotions/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete promotion");
      }

      showSnackbar("Promotion deleted successfully");
      setOpenDeleteDialog(false);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      showSnackbar(error.message || "Error deleting promotion", "error");
    }
  };

  const handleCreatePromotion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/promotions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newPromotion.code,
          title: newPromotion.title,
          description: newPromotion.description,
          discountType: newPromotion.discountType,
          discountValue: parseFloat(newPromotion.discountValue),
          minRideAmount: parseFloat(newPromotion.minRideAmount),
          maxDiscount: parseFloat(newPromotion.maxDiscount),
          startDate: newPromotion.startDate ? `${newPromotion.startDate}T00:00:00Z` : null,
          endDate: newPromotion.endDate ? `${newPromotion.endDate}T23:59:59Z` : null,
          usageLimit: parseInt(newPromotion.usageLimit),
          userType: newPromotion.userType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create promotion");
      }

      showSnackbar("Promotion created successfully");
      setOpenCreateDialog(false);
      setNewPromotion({
        code: "",
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minRideAmount: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        userType: "new",
      });
      fetchPromotions();
    } catch (error) {
      console.error("Error creating promotion:", error);
      showSnackbar(error.message || "Error creating promotion", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "inactive":
        return <Chip label="Inactive" color="warning" size="small" icon={<CancelIcon />} />;
      case "expired":
        return <Chip label="Expired" color="error" size="small" icon={<EventBusyIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getUserTypeChip = (userType) => {
    switch (userType) {
      case "new":
        return <Chip label="New Users" color="primary" size="small" />;
      case "existing":
        return <Chip label="Existing Users" color="secondary" size="small" />;
      case "all":
        return <Chip label="All Users" color="info" size="small" />;
      default:
        return <Chip label={userType} size="small" />;
    }
  };

  const getDiscountDisplay = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountValue}% off`;
    }
    return `$${promotion.discountValue} off`;
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
  const StatusCell = ({ value }) => getStatusChip(value);
  StatusCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  const UserTypeCell = ({ value }) => getUserTypeChip(value);
  UserTypeCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  const DiscountCell = ({ value }) => getDiscountDisplay(value);
  DiscountCell.propTypes = {
    value: PropTypes.shape({
      discountType: PropTypes.string.isRequired,
      discountValue: PropTypes.string.isRequired,
    }).isRequired,
  };

  const DateCell = ({ value }) => new Date(value).toLocaleDateString();
  DateCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  const columns = [
    { Header: "Code", accessor: "code" },
    { Header: "Title", accessor: "title" },
    {
      Header: "Discount",
      accessor: (row) => row,
      Cell: DiscountCell,
    },
    {
      Header: "Valid Until",
      accessor: "endDate",
      Cell: DateCell,
    },
    {
      Header: "User Type",
      accessor: "userType",
      Cell: UserTypeCell,
    },
    {
      Header: "Status",
      accessor: "status",
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
              <IconButton onClick={() => handleViewPromotion(row.original)}>
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

  const filteredPromotions = promotions.filter((promotion) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      promotion.code.toLowerCase().includes(searchTermLower) ||
      promotion.title.toLowerCase().includes(searchTermLower) ||
      promotion.description.toLowerCase().includes(searchTermLower)
    );
  });

  // Apply pagination
  const paginatedPromotions = filteredPromotions.slice(
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
                    Promotions
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
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>User Type</InputLabel>
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="User Type"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="new">New Users</MenuItem>
                        <MenuItem value="existing">Existing Users</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search promotions"
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
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<AddIcon />}
                      onClick={handleOpenCreateDialog}
                    >
                      Create Promotion
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedPromotions }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredPromotions.length}
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

      {/* Promotion Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Promotion Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewPromotionData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Code:</strong> {viewPromotionData.code}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Title:</strong> {viewPromotionData.title}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Description:</strong> {viewPromotionData.description}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Discount:</strong> {getDiscountDisplay(viewPromotionData)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Minimum Ride Amount:</strong> ${viewPromotionData.minRideAmount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Max Discount:</strong> ${viewPromotionData.maxDiscount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Usage Limit:</strong> {viewPromotionData.usageLimit}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Used Count:</strong> {viewPromotionData.usedCount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>User Type:</strong> {getUserTypeChip(viewPromotionData.userType)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewPromotionData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Start Date:</strong>{" "}
                      {new Date(viewPromotionData.startDate).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>End Date:</strong>{" "}
                      {new Date(viewPromotionData.endDate).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewPromotionData.created_at).toLocaleString()}
                    </MDTypography>
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

      {/* Edit Promotion Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Promotion</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                label="Status"
                sx={{ width: 300, height: 40 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Max Discount ($)"
              fullWidth
              margin="normal"
              type="number"
              value={editData.maxDiscount}
              onChange={(e) => setEditData({ ...editData, maxDiscount: e.target.value })}
            />
            <TextField
              label="End Date"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editData.endDate}
              onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePromotion} color="error" variant="contained">
            Save Changes
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
              Are you sure you want to delete this promotion? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeletePromotion} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Promotion Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Promotion</MDTypography>
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
                  label="Promo Code"
                  fullWidth
                  margin="normal"
                  value={newPromotion.code}
                  onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={newPromotion.description}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, description: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={newPromotion.discountType}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, discountType: e.target.value })
                    }
                    label="Discount Type"
                    required
                    sx={{ width: 350, height: 44 }}
                  >
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    newPromotion.discountType === "percentage"
                      ? "Discount Value (%)"
                      : "Discount Value ($)"
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                  value={newPromotion.discountValue}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, discountValue: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Ride Amount ($)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={newPromotion.minRideAmount}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, minRideAmount: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Max Discount ($)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={newPromotion.maxDiscount}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, maxDiscount: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPromotion.startDate}
                  onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPromotion.endDate}
                  onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Usage Limit"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={newPromotion.usageLimit}
                  onChange={(e) => setNewPromotion({ ...newPromotion, usageLimit: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={newPromotion.userType}
                    onChange={(e) => setNewPromotion({ ...newPromotion, userType: e.target.value })}
                    label="User Type"
                    required
                    sx={{ width: 350, height: 44 }}
                  >
                    <MenuItem value="new">New Users</MenuItem>
                    <MenuItem value="existing">Existing Users</MenuItem>
                    <MenuItem value="all">All Users</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePromotion} color="error" variant="contained">
            Create Promotion
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

Promotions.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      discountType: PropTypes.string.isRequired,
      discountValue: PropTypes.string.isRequired,
      minRideAmount: PropTypes.string.isRequired,
      maxDiscount: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      usageLimit: PropTypes.number.isRequired,
      usedCount: PropTypes.number.isRequired,
      userType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Promotions;
