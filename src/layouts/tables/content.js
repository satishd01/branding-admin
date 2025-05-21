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
import DoneAllIcon from "@mui/icons-material/DoneAll";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

function Content() {
  const theme = useTheme();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("terms");
  const [statusFilter, setStatusFilter] = useState("active");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewContentData, setViewContentData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editContentData, setEditContentData] = useState({
    id: null,
    type: "terms",
    title: "",
    content: "",
    version: "1.0",
    status: "active",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newContentData, setNewContentData] = useState({
    type: "terms",
    title: "",
    content: "",
    version: "1.0",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchContents();
  }, [typeFilter, statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/v1/cms/content?type=${typeFilter}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }

      const data = await response.json();
      setContents(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching content:", error);
      showSnackbar("Error fetching content", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (content) => {
    setViewContentData(content);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (content) => {
    setEditContentData({
      id: content.id,
      type: content.type,
      title: content.title,
      content: content.content,
      version: content.version,
      status: content.status,
    });
    setOpenEditDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setNewContentData({
      type: typeFilter,
      title: "",
      content: "",
      version: "1.0",
    });
    setOpenCreateDialog(true);
  };

  const handleUpdateContent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/content/${editContentData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: editContentData.type,
          title: editContentData.title,
          content: editContentData.content,
          version: editContentData.version,
          status: editContentData.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      showSnackbar("Content updated successfully");
      setOpenEditDialog(false);
      fetchContents();
    } catch (error) {
      console.error("Error updating content:", error);
      showSnackbar(error.message || "Error updating content", "error");
    }
  };

  const handleCreateContent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/content`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      showSnackbar("Content created successfully");
      setOpenCreateDialog(false);
      fetchContents();
    } catch (error) {
      console.error("Error creating content:", error);
      showSnackbar(error.message || "Error creating content", "error");
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/content/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      showSnackbar("Content deleted successfully");
      fetchContents();
    } catch (error) {
      console.error("Error deleting content:", error);
      showSnackbar(error.message || "Error deleting content", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon />} />;
      case "inactive":
        return <Chip label="Inactive" color="error" size="small" icon={<CancelIcon />} />;
      case "draft":
        return <Chip label="Draft" color="warning" size="small" icon={<EditIcon />} />;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Type", accessor: "type" },
    { Header: "Title", accessor: "title" },
    { Header: "Version", accessor: "version" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Last Updated",
      accessor: (row) => formatDate(row.updatedAt),
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
              <IconButton onClick={() => handleViewContent(row.original)}>
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
                <ListItemText>Edit Content</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleDeleteContent(row.original.id)}>
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

  const filteredContents = contents.filter((content) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (content.id && content.id.toString().includes(searchTermLower)) ||
      (content.type && content.type.toLowerCase().includes(searchTermLower)) ||
      (content.title && content.title.toLowerCase().includes(searchTermLower)) ||
      (content.version && content.version.toLowerCase().includes(searchTermLower))
    );
  });

  // Apply pagination
  const paginatedContents = filteredContents.slice(
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
                    Content Management
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                        sx={{
                          width: 150,
                          height: 35,
                        }}
                      >
                        <MenuItem value="terms">Terms</MenuItem>
                        <MenuItem value="privacy">Privacy</MenuItem>
                        <MenuItem value="about">About</MenuItem>
                        <MenuItem value="faq">FAQ</MenuItem>
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
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search content"
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
                      Add Content
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedContents }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredContents.length}
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

      {/* Content Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Content Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewContentData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewContentData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Type:</strong> {viewContentData.type}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewContentData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Version:</strong> {viewContentData.version}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong> {formatDate(viewContentData.createdAt)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Last Updated:</strong> {formatDate(viewContentData.updatedAt)}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Content Details
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Title:</strong> {viewContentData.title}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Content:</strong>
                    </MDTypography>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: 1,
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: viewContentData.content }} />
                    </Box>
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

      {/* Edit Content Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Edit Content</MDTypography>
            <IconButton onClick={() => setOpenEditDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={editContentData.type}
                    onChange={(e) =>
                      setEditContentData({ ...editContentData, type: e.target.value })
                    }
                    label="Type"
                  >
                    <MenuItem value="terms">Terms</MenuItem>
                    <MenuItem value="privacy">Privacy</MenuItem>
                    <MenuItem value="about">About</MenuItem>
                    <MenuItem value="faq">FAQ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editContentData.status}
                    onChange={(e) =>
                      setEditContentData({ ...editContentData, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  value={editContentData.title}
                  onChange={(e) =>
                    setEditContentData({ ...editContentData, title: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Version"
                  value={editContentData.version}
                  onChange={(e) =>
                    setEditContentData({ ...editContentData, version: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Content"
                  multiline
                  rows={10}
                  value={editContentData.content}
                  onChange={(e) =>
                    setEditContentData({ ...editContentData, content: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateContent} color="primary" variant="contained">
            Update Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Content</MDTypography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newContentData.type}
                    onChange={(e) => setNewContentData({ ...newContentData, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="terms">Terms</MenuItem>
                    <MenuItem value="privacy">Privacy</MenuItem>
                    <MenuItem value="about">About</MenuItem>
                    <MenuItem value="faq">FAQ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Version"
                  value={newContentData.version}
                  onChange={(e) =>
                    setNewContentData({ ...newContentData, version: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  value={newContentData.title}
                  onChange={(e) => setNewContentData({ ...newContentData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Content"
                  multiline
                  rows={10}
                  value={newContentData.content}
                  onChange={(e) =>
                    setNewContentData({ ...newContentData, content: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateContent} color="primary" variant="contained">
            Create Content
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

Content.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      lastUpdatedBy: PropTypes.number,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Content;
