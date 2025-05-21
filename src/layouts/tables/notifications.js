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
  Avatar,
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

function Notifications() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewNotificationData, setViewNotificationData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    message: "",
    type: "promotion",
    targetAudience: "all",
    priority: "medium",
    status: "draft",
    scheduledAt: "",
    imageUrl: "",
    actionUrl: "",
    targetIds: [],
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "promotion",
    targetAudience: "all",
    priority: "medium",
    status: "draft",
    scheduledAt: "",
    imageUrl: "",
    actionUrl: "",
    targetIds: [],
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter, typeFilter, targetFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      let url = `${BASE_URL}/v1/cms/notifications`;

      // Add filters if not "all"
      const params = [];
      if (statusFilter !== "all") {
        params.push(`status=${statusFilter}`);
      }
      if (typeFilter !== "all") {
        params.push(`type=${typeFilter}`);
      }
      if (targetFilter !== "all") {
        params.push(`targetAudience=${targetFilter}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching notification data:", error);
      showSnackbar("Error fetching notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (notification) => {
    setViewNotificationData(notification);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (notification) => {
    setEditData({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      priority: notification.priority,
      status: notification.status,
      scheduledAt: notification.scheduledAt ? notification.scheduledAt.split("T")[0] : "",
      imageUrl: notification.imageUrl || "",
      actionUrl: notification.actionUrl || "",
      targetIds: notification.targetIds || [],
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

  const handleUpdateNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/notifications/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title,
          message: editData.message,
          type: editData.type,
          targetAudience: editData.targetAudience,
          priority: editData.priority,
          status: editData.status,
          scheduledAt: editData.scheduledAt ? `${editData.scheduledAt}T00:00:00Z` : null,
          imageUrl: editData.imageUrl || null,
          actionUrl: editData.actionUrl || null,
          targetIds: editData.targetIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification");
      }

      showSnackbar("Notification updated successfully");
      setOpenEditDialog(false);
      fetchNotifications();
    } catch (error) {
      console.error("Error updating notification:", error);
      showSnackbar(error.message || "Error updating notification", "error");
    }
  };

  const handleDeleteNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/notifications/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      showSnackbar("Notification deleted successfully");
      setOpenDeleteDialog(false);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      showSnackbar(error.message || "Error deleting notification", "error");
    }
  };

  const handleCreateNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/notifications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          targetAudience: newNotification.targetAudience,
          priority: newNotification.priority,
          status: newNotification.status,
          scheduledAt: newNotification.scheduledAt
            ? `${newNotification.scheduledAt}T00:00:00Z`
            : null,
          imageUrl: newNotification.imageUrl || null,
          actionUrl: newNotification.actionUrl || null,
          targetIds: newNotification.targetIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      showSnackbar("Notification created successfully");
      setOpenCreateDialog(false);
      setNewNotification({
        title: "",
        message: "",
        type: "promotion",
        targetAudience: "all",
        priority: "medium",
        status: "draft",
        scheduledAt: "",
        imageUrl: "",
        actionUrl: "",
        targetIds: [],
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      showSnackbar(error.message || "Error creating notification", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "sent":
        return <Chip label="Sent" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "scheduled":
        return <Chip label="Scheduled" color="info" size="small" icon={<EventAvailableIcon />} />;
      case "draft":
        return <Chip label="Draft" color="warning" size="small" icon={<CancelIcon />} />;
      case "failed":
        return <Chip label="Failed" color="error" size="small" icon={<EventBusyIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getTypeChip = (type) => {
    switch (type) {
      case "promotion":
        return <Chip label="Promotion" color="primary" size="small" />;
      case "alert":
        return <Chip label="Alert" color="secondary" size="small" />;
      case "update":
        return <Chip label="Update" color="info" size="small" />;
      default:
        return <Chip label={type} size="small" />;
    }
  };

  const getTargetChip = (target) => {
    switch (target) {
      case "all":
        return <Chip label="All Users" color="success" size="small" />;
      case "specific":
        return <Chip label="Specific Users" color="warning" size="small" />;
      case "group":
        return <Chip label="User Group" color="info" size="small" />;
      default:
        return <Chip label={target} size="small" />;
    }
  };

  const getPriorityChip = (priority) => {
    switch (priority) {
      case "high":
        return <Chip label="High" color="error" size="small" />;
      case "medium":
        return <Chip label="Medium" color="warning" size="small" />;
      case "low":
        return <Chip label="Low" color="info" size="small" />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  const DateCell = ({ value }) => (value ? new Date(value).toLocaleString() : "Not scheduled");
  DateCell.propTypes = {
    value: PropTypes.string,
  };

  const TargetIdsCell = ({ value }) => (
    <Box>
      {value && value.length > 0 ? (
        <Tooltip title={value.join(", ")}>
          <Chip label={`${value.length} targets`} size="small" />
        </Tooltip>
      ) : (
        <Chip label="All users" size="small" />
      )}
    </Box>
  );
  TargetIdsCell.propTypes = {
    value: PropTypes.array,
  };

  // ActionsCell component for action buttons in the table
  const ActionsCell = ({ row }) => (
    <Box display="flex" gap={1}>
      <Tooltip title="View">
        <IconButton color="primary" onClick={() => handleViewNotification(row.original)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton color="info" onClick={() => handleOpenEditDialog(row.original)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => handleOpenDeleteDialog(row.original.id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  ActionsCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        message: PropTypes.string,
        type: PropTypes.string,
        targetAudience: PropTypes.string,
        priority: PropTypes.string,
        status: PropTypes.string,
        scheduledAt: PropTypes.string,
        sentAt: PropTypes.string,
        imageUrl: PropTypes.string,
        actionUrl: PropTypes.string,
        targetIds: PropTypes.array,
      }).isRequired,
    }).isRequired,
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => getTypeChip(value),
    },
    {
      Header: "Target",
      accessor: "targetAudience",
      Cell: ({ value }) => getTargetChip(value),
    },
    {
      Header: "Target IDs",
      accessor: "targetIds",
      Cell: TargetIdsCell,
    },
    {
      Header: "Priority",
      accessor: "priority",
      Cell: ({ value }) => getPriorityChip(value),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Scheduled At",
      accessor: "scheduledAt",
      Cell: DateCell,
    },
    {
      Header: "Sent At",
      accessor: "sentAt",
      Cell: DateCell,
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ActionsCell,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      notification.title.toLowerCase().includes(searchTermLower) ||
      (notification.message && notification.message.toLowerCase().includes(searchTermLower)) ||
      notification.id.toString().includes(searchTermLower)
    );
  });

  // Apply pagination
  const paginatedNotifications = filteredNotifications.slice(
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
                    Notifications
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
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="sent">Sent</MenuItem>
                        <MenuItem value="scheduled">Scheduled</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
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
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="promotion">Promotion</MenuItem>
                        <MenuItem value="alert">Alert</MenuItem>
                        <MenuItem value="update">Update</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Target</InputLabel>
                      <Select
                        value={targetFilter}
                        onChange={(e) => setTargetFilter(e.target.value)}
                        label="Target"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="all">All Users</MenuItem>
                        <MenuItem value="specific">Specific Users</MenuItem>
                        <MenuItem value="group">User Group</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search notifications"
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
                      Create Notification
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedNotifications }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredNotifications.length}
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

      {/* Notification Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Notification Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewNotificationData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewNotificationData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Title:</strong> {viewNotificationData.title}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Message:</strong> {viewNotificationData.message}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Type:</strong> {getTypeChip(viewNotificationData.type)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Target:</strong> {getTargetChip(viewNotificationData.targetAudience)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Priority:</strong> {getPriorityChip(viewNotificationData.priority)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewNotificationData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Scheduled At:</strong>{" "}
                      {viewNotificationData.scheduledAt
                        ? new Date(viewNotificationData.scheduledAt).toLocaleString()
                        : "Not scheduled"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Sent At:</strong>{" "}
                      {viewNotificationData.sentAt
                        ? new Date(viewNotificationData.sentAt).toLocaleString()
                        : "Not sent"}
                    </MDTypography>
                  </Grid>
                  {viewNotificationData.imageUrl && (
                    <Grid item xs={12}>
                      <MDTypography>
                        <strong>Image URL:</strong>{" "}
                        <a
                          href={viewNotificationData.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {viewNotificationData.imageUrl}
                        </a>
                      </MDTypography>
                    </Grid>
                  )}
                  {viewNotificationData.actionUrl && (
                    <Grid item xs={12}>
                      <MDTypography>
                        <strong>Action URL:</strong>{" "}
                        <a
                          href={viewNotificationData.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {viewNotificationData.actionUrl}
                        </a>
                      </MDTypography>
                    </Grid>
                  )}
                  {viewNotificationData.targetIds && viewNotificationData.targetIds.length > 0 && (
                    <Grid item xs={12}>
                      <MDTypography>
                        <strong>Target IDs:</strong> {viewNotificationData.targetIds.join(", ")}
                      </MDTypography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewNotificationData.created_at).toLocaleString()}
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

      {/* Edit Notification Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Notification</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={editData.message}
                  onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    label="Type"
                    required
                  >
                    <MenuItem value="promotion">Promotion</MenuItem>
                    <MenuItem value="alert">Alert</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={editData.targetAudience}
                    onChange={(e) => setEditData({ ...editData, targetAudience: e.target.value })}
                    label="Target Audience"
                    required
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="specific">Specific Users</MenuItem>
                    <MenuItem value="group">User Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {editData.targetAudience !== "all" && (
                <Grid item xs={12}>
                  <TextField
                    label="Target IDs (comma separated)"
                    fullWidth
                    margin="normal"
                    value={editData.targetIds.join(",")}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        targetIds: e.target.value.split(",").map((id) => id.trim()),
                      })
                    }
                    helperText="Enter comma separated user IDs"
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    label="Priority"
                    required
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    label="Status"
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Scheduled At"
                  fullWidth
                  margin="normal"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={editData.scheduledAt}
                  onChange={(e) => setEditData({ ...editData, scheduledAt: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  value={editData.imageUrl}
                  onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Action URL"
                  fullWidth
                  margin="normal"
                  value={editData.actionUrl}
                  onChange={(e) => setEditData({ ...editData, actionUrl: e.target.value })}
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateNotification} color="error" variant="contained">
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
              Are you sure you want to delete this notification? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteNotification} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Notification Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Notification</MDTypography>
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
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, title: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, message: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newNotification.type}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, type: e.target.value })
                    }
                    label="Type"
                    required
                  >
                    <MenuItem value="promotion">Promotion</MenuItem>
                    <MenuItem value="alert">Alert</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={newNotification.targetAudience}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, targetAudience: e.target.value })
                    }
                    label="Target Audience"
                    required
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="specific">Specific Users</MenuItem>
                    <MenuItem value="group">User Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {newNotification.targetAudience !== "all" && (
                <Grid item xs={12}>
                  <TextField
                    label="Target IDs (comma separated)"
                    fullWidth
                    margin="normal"
                    value={newNotification.targetIds.join(",")}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        targetIds: e.target.value.split(",").map((id) => id.trim()),
                      })
                    }
                    helperText="Enter comma separated user IDs"
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newNotification.priority}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, priority: e.target.value })
                    }
                    label="Priority"
                    required
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newNotification.status}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, status: e.target.value })
                    }
                    label="Status"
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Scheduled At"
                  fullWidth
                  margin="normal"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={newNotification.scheduledAt}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, scheduledAt: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  value={newNotification.imageUrl}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, imageUrl: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Action URL"
                  fullWidth
                  margin="normal"
                  value={newNotification.actionUrl}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, actionUrl: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateNotification} color="error" variant="contained">
            Create Notification
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

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDeleteNotification: PropTypes.func.isRequired,
  onUpdateNotification: PropTypes.func.isRequired,
  onCreateNotification: PropTypes.func.isRequired,
};

export default Notifications;
