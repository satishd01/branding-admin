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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  List,
  ListItem,
  ListItemText as MuiListItemText,
  ListItemButton,
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
import ScheduleIcon from "@mui/icons-material/Schedule";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

const daysOfWeek = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

function DynamicPricing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewPricingData, setViewPricingData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    name: "",
    description: "",
    multiplier: 1.0,
    startTime: "",
    endTime: "",
    daysOfWeek: [],
    locationBounds: {
      type: "Polygon",
      coordinates: [],
    },
    minDemandFactor: 1.0,
    status: "active",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newPricingRule, setNewPricingRule] = useState({
    name: "",
    description: "",
    multiplier: 1.0,
    startTime: "",
    endTime: "",
    daysOfWeek: [],
    locationBounds: {
      type: "Polygon",
      coordinates: [],
    },
    minDemandFactor: 1.0,
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPricingRules();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchPricingRules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const url = `${BASE_URL}/v1/admin/pricing-rules?status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pricing rules");
      }

      const data = await response.json();
      setPricingRules(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching pricing rules:", error);
      showSnackbar("Error fetching pricing rules", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPricingRule = (rule) => {
    setViewPricingData(rule);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (rule) => {
    setEditData({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      multiplier: rule.multiplier,
      startTime: rule.startTime,
      endTime: rule.endTime,
      daysOfWeek: rule.daysOfWeek,
      locationBounds: rule.locationBounds,
      minDemandFactor: rule.minDemandFactor,
      status: rule.status,
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

  const handleUpdatePricingRule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/pricing-rules/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name,
          description: editData.description,
          multiplier: parseFloat(editData.multiplier),
          startTime: editData.startTime,
          endTime: editData.endTime,
          daysOfWeek: editData.daysOfWeek,
          locationBounds: editData.locationBounds,
          minDemandFactor: parseFloat(editData.minDemandFactor),
          status: editData.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pricing rule");
      }

      showSnackbar("Pricing rule updated successfully");
      setOpenEditDialog(false);
      fetchPricingRules();
    } catch (error) {
      console.error("Error updating pricing rule:", error);
      showSnackbar(error.message || "Error updating pricing rule", "error");
    }
  };

  const handleDeletePricingRule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/pricing-rules/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete pricing rule");
      }

      showSnackbar("Pricing rule deleted successfully");
      setOpenDeleteDialog(false);
      fetchPricingRules();
    } catch (error) {
      console.error("Error deleting pricing rule:", error);
      showSnackbar(error.message || "Error deleting pricing rule", "error");
    }
  };

  const handleCreatePricingRule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/admin/pricing-rules`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPricingRule.name,
          description: newPricingRule.description,
          multiplier: parseFloat(newPricingRule.multiplier),
          startTime: newPricingRule.startTime,
          endTime: newPricingRule.endTime,
          daysOfWeek: newPricingRule.daysOfWeek,
          locationBounds: newPricingRule.locationBounds,
          minDemandFactor: parseFloat(newPricingRule.minDemandFactor),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create pricing rule");
      }

      showSnackbar("Pricing rule created successfully");
      setOpenCreateDialog(false);
      setNewPricingRule({
        name: "",
        description: "",
        multiplier: 1.0,
        startTime: "",
        endTime: "",
        daysOfWeek: [],
        locationBounds: {
          type: "Polygon",
          coordinates: [],
        },
        minDemandFactor: 1.0,
      });
      fetchPricingRules();
    } catch (error) {
      console.error("Error creating pricing rule:", error);
      showSnackbar(error.message || "Error creating pricing rule", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "inactive":
        return <Chip label="Inactive" color="warning" size="small" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getDaysOfWeekDisplay = (days) => {
    if (days.length === 7) return "Every day";
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
    return days.map((day) => daysOfWeek.find((d) => d.id === day)?.name.substring(0, 3)).join(", ");
  };

  const handleDaySelection = (dayId, isChecked, isEdit = false) => {
    if (isEdit) {
      setEditData((prev) => ({
        ...prev,
        daysOfWeek: isChecked
          ? [...prev.daysOfWeek, dayId]
          : prev.daysOfWeek.filter((id) => id !== dayId),
      }));
    } else {
      setNewPricingRule((prev) => ({
        ...prev,
        daysOfWeek: isChecked
          ? [...prev.daysOfWeek, dayId]
          : prev.daysOfWeek.filter((id) => id !== dayId),
      }));
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
  const StatusCell = ({ value }) => getStatusChip(value);
  StatusCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  const DaysCell = ({ value }) => getDaysOfWeekDisplay(value);
  DaysCell.propTypes = {
    value: PropTypes.array.isRequired,
  };

  const TimeRangeCell = ({ value }) => (
    <Box display="flex" alignItems="center">
      <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
      {value.startTime} - {value.endTime}
    </Box>
  );
  TimeRangeCell.propTypes = {
    value: PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    }).isRequired,
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { Header: "Multiplier", accessor: "multiplier" },
    {
      Header: "Time Range",
      accessor: (row) => ({ startTime: row.startTime, endTime: row.endTime }),
      Cell: TimeRangeCell,
    },
    {
      Header: "Days Active",
      accessor: "daysOfWeek",
      Cell: DaysCell,
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
              <IconButton onClick={() => handleViewPricingRule(row.original)}>
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

  const filteredPricingRules = pricingRules.filter((rule) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      rule.name.toLowerCase().includes(searchTermLower) ||
      rule.description.toLowerCase().includes(searchTermLower)
    );
  });

  // Apply pagination
  const paginatedPricingRules = filteredPricingRules.slice(
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
                    Dynamic Pricing Rules
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
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search rules"
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
                      New Pricing Rule
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedPricingRules }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredPricingRules.length}
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

      {/* Pricing Rule Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Pricing Rule Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewPricingData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewPricingData.name}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewPricingData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Description:</strong> {viewPricingData.description}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Multiplier:</strong> {viewPricingData.multiplier}x
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Min Demand Factor:</strong> {viewPricingData.minDemandFactor}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Time Range:</strong> {viewPricingData.startTime} -{" "}
                      {viewPricingData.endTime}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Active Days:</strong>{" "}
                      {getDaysOfWeekDisplay(viewPricingData.daysOfWeek)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Location Bounds:</strong>{" "}
                      {JSON.stringify(viewPricingData.locationBounds)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewPricingData.created_at).toLocaleString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Updated At:</strong>{" "}
                      {new Date(viewPricingData.updated_at).toLocaleString()}
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

      {/* Edit Pricing Rule Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Pricing Rule</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
            <TextField
              label="Multiplier"
              fullWidth
              margin="normal"
              type="number"
              step="0.1"
              value={editData.multiplier}
              onChange={(e) => setEditData({ ...editData, multiplier: e.target.value })}
              required
            />
            <TextField
              label="Start Time"
              fullWidth
              margin="normal"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={editData.startTime}
              onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
              required
            />
            <TextField
              label="End Time"
              fullWidth
              margin="normal"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={editData.endTime}
              onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
              required
            />
            <TextField
              label="Min Demand Factor"
              fullWidth
              margin="normal"
              type="number"
              step="0.1"
              value={editData.minDemandFactor}
              onChange={(e) => setEditData({ ...editData, minDemandFactor: e.target.value })}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                label="Status"
                required
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <MDBox mt={2}>
              <MDTypography variant="subtitle2">Active Days</MDTypography>
              <FormGroup row>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day.id}
                    control={
                      <Checkbox
                        checked={editData.daysOfWeek.includes(day.id)}
                        onChange={(e) => handleDaySelection(day.id, e.target.checked, true)}
                        name={day.name}
                      />
                    }
                    label={day.name.substring(0, 3)}
                  />
                ))}
              </FormGroup>
            </MDBox>
            <MDBox mt={2}>
              <MDTypography variant="subtitle2">Location Bounds (Polygon Coordinates)</MDTypography>
              <TextField
                label="Location Bounds JSON"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={JSON.stringify(editData.locationBounds, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditData({ ...editData, locationBounds: parsed });
                  } catch (error) {
                    console.error("Invalid JSON input");
                  }
                }}
                helperText="Enter valid GeoJSON Polygon coordinates"
              />
            </MDBox>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePricingRule} color="error" variant="contained">
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
              Are you sure you want to delete this pricing rule? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeletePricingRule} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Pricing Rule Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Pricing Rule</MDTypography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Rule Name"
                  fullWidth
                  margin="normal"
                  value={newPricingRule.name}
                  onChange={(e) => setNewPricingRule({ ...newPricingRule, name: e.target.value })}
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
                  value={newPricingRule.description}
                  onChange={(e) =>
                    setNewPricingRule({ ...newPricingRule, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Price Multiplier"
                  fullWidth
                  margin="normal"
                  type="number"
                  step="0.1"
                  value={newPricingRule.multiplier}
                  onChange={(e) =>
                    setNewPricingRule({ ...newPricingRule, multiplier: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Demand Factor"
                  fullWidth
                  margin="normal"
                  type="number"
                  step="0.1"
                  value={newPricingRule.minDemandFactor}
                  onChange={(e) =>
                    setNewPricingRule({ ...newPricingRule, minDemandFactor: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Time"
                  fullWidth
                  margin="normal"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={newPricingRule.startTime}
                  onChange={(e) =>
                    setNewPricingRule({ ...newPricingRule, startTime: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Time"
                  fullWidth
                  margin="normal"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={newPricingRule.endTime}
                  onChange={(e) =>
                    setNewPricingRule({ ...newPricingRule, endTime: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <MDBox mt={2}>
                  <MDTypography variant="subtitle2">Active Days</MDTypography>
                  <FormGroup row>
                    {daysOfWeek.map((day) => (
                      <FormControlLabel
                        key={day.id}
                        control={
                          <Checkbox
                            checked={newPricingRule.daysOfWeek.includes(day.id)}
                            onChange={(e) => handleDaySelection(day.id, e.target.checked)}
                            name={day.name}
                          />
                        }
                        label={day.name.substring(0, 3)}
                      />
                    ))}
                  </FormGroup>
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox mt={2}>
                  <MDTypography variant="subtitle2">
                    Location Bounds (Polygon Coordinates)
                  </MDTypography>
                  <TextField
                    label="Location Bounds JSON"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={JSON.stringify(newPricingRule.locationBounds, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setNewPricingRule({ ...newPricingRule, locationBounds: parsed });
                      } catch (error) {
                        console.error("Invalid JSON input");
                      }
                    }}
                    helperText="Enter valid GeoJSON Polygon coordinates"
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePricingRule} color="error" variant="contained">
            Create Rule
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

DynamicPricing.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      multiplier: PropTypes.number.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      daysOfWeek: PropTypes.array.isRequired,
      locationBounds: PropTypes.object.isRequired,
      minDemandFactor: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DynamicPricing;
