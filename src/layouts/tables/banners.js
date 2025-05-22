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

// Actions column cell (moved inside Banners for handler access)

function Banners() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewBannerData, setViewBannerData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    imageUrl: "",
    description: "",
    link: "",
    type: "home",
    position: "top",
    status: "active",
    startDate: "",
    endDate: "",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    imageUrl: "",
    description: "",
    link: "",
    type: "home",
    position: "top",
    status: "active",
    startDate: "",
    endDate: "",
  });
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBanners();
  }, [statusFilter, typeFilter, positionFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      let url = `${BASE_URL}/v1/cms/banners?status=${statusFilter}`;

      if (typeFilter !== "all") {
        url += `&type=${typeFilter}`;
      }
      if (positionFilter !== "all") {
        url += `&position=${positionFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }

      const data = await response.json();
      setBanners(data.data);
      setPage(0); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching banner data:", error);
      showSnackbar("Error fetching banners", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return null;
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await fetch(`${BASE_URL}/v1/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const data = await response.json();
      return data.data.files;
    } catch (error) {
      console.error("Error uploading files:", error);
      showSnackbar(error.message || "Error uploading files", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleViewBanner = (banner) => {
    setViewBannerData(banner);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (banner) => {
    setEditData({
      id: banner.id,
      title: banner.title,
      imageUrl: banner.imageUrl,
      description: banner.description,
      link: banner.link,
      type: banner.type,
      position: banner.position,
      status: banner.status,
      startDate: banner.startDate.split("T")[0],
      endDate: banner.endDate.split("T")[0],
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

  const handleUpdateBanner = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/banners/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title,
          imageUrl: editData.imageUrl,
          description: editData.description,
          link: editData.link,
          type: editData.type,
          position: editData.position,
          status: editData.status,
          startDate: editData.startDate ? `${editData.startDate}T00:00:00Z` : null,
          endDate: editData.endDate ? `${editData.endDate}T23:59:59Z` : null,
        }),
      });

      showSnackbar("Banner updated successfully");
      setOpenEditDialog(false);
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      showSnackbar(error.message || "Error updating banner", "error");
    }
  };

  const handleDeleteBanner = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/banners/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      showSnackbar("Banner deleted successfully");
      setOpenDeleteDialog(false);
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      showSnackbar(error.message || "Error deleting banner", "error");
    }
  };

  const handleCreateBanner = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cms/banners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBanner.title,
          imageUrl: newBanner.imageUrl,
          description: newBanner.description,
          link: newBanner.link,
          type: newBanner.type,
          position: newBanner.position,
          status: newBanner.status,
          startDate: newBanner.startDate ? `${newBanner.startDate}T00:00:00Z` : null,
          endDate: newBanner.endDate ? `${newBanner.endDate}T23:59:59Z` : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create banner");
      }

      showSnackbar("Banner created successfully");
      setOpenCreateDialog(false);
      setNewBanner({
        title: "",
        imageUrl: "",
        description: "",
        link: "",
        type: "home",
        position: "top",
        status: "active",
        startDate: "",
        endDate: "",
      });
      fetchBanners();
    } catch (error) {
      console.error("Error creating banner:", error);
      showSnackbar(error.message || "Error creating banner", "error");
    }
  };
  // Helper to render a Chip for banner type
  function getTypeChip(type) {
    let color = "default";
    let label = type;
    switch (type) {
      case "home":
        color = "primary";
        label = "Home";
        break;
      case "promo":
        color = "success";
        label = "Promo";
        break;
      case "category":
        color = "info";
        label = "Category";
        break;
      default:
        color = "default";
        label = type;
    }
    return <Chip label={label} color={color} size="small" />;
  }

  // Helper to render a Chip for banner position
  function getPositionChip(position) {
    let color = "default";
    let label = position;
    switch (position) {
      case "top":
        color = "primary";
        label = "Top";
        break;
      case "middle":
        color = "secondary";
        label = "Middle";
        break;
      case "bottom":
        color = "info";
        label = "Bottom";
        break;
      default:
        color = "default";
        label = position;
    }
    return <Chip label={label} color={color} size="small" />;
  }

  // Helper to render a Chip for banner status
  function getStatusChip(status) {
    let color = "default";
    let label = status;
    switch (status) {
      case "active":
        color = "success";
        label = "Active";
        break;
      case "inactive":
        color = "warning";
        label = "Inactive";
        break;
      case "expired":
        color = "error";
        label = "Expired";
        break;
      default:
        color = "default";
        label = status;
    }
    return <Chip label={label} color={color} size="small" />;
  }
  // Actions column cell component
  function ActionsColumnCell({ row, onView, onEdit, onDelete }) {
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
          aria-controls="actions-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="actions-menu"
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
              onView(row.original);
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
              onEdit(row.original);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete(row.original.id);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </>
    );
  }

  ActionsColumnCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      }).isRequired,
    }).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  // Define columns for DataTable
  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => getTypeChip(value),
    },
    {
      Header: "Position",
      accessor: "position",
      Cell: ({ value }) => getPositionChip(value),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      Header: "End Date",
      accessor: "endDate",
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (cellProps) => (
        <ActionsColumnCell
          {...cellProps}
          onView={handleViewBanner}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDeleteDialog}
        />
      ),
    },
  ];

  const filteredBanners = banners.filter((banner) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      banner.title.toLowerCase().includes(searchTermLower) ||
      (banner.description && banner.description.toLowerCase().includes(searchTermLower)) ||
      banner.id.toString().includes(searchTermLower)
    );
  });

  // Apply pagination
  const paginatedBanners = filteredBanners.slice(
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
                    Banners
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
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="home">Home</MenuItem>
                        <MenuItem value="promo">Promo</MenuItem>
                        <MenuItem value="category">Category</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel>Position</InputLabel>
                      <Select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        label="Position"
                        sx={{ width: 150, height: 35 }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="top">Top</MenuItem>
                        <MenuItem value="middle">Middle</MenuItem>
                        <MenuItem value="bottom">Bottom</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search banners"
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
                      Create Banner
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedBanners }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredBanners.length}
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

      {/* Banner Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Banner Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewBannerData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewBannerData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Title:</strong> {viewBannerData.title}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Description:</strong> {viewBannerData.description || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Image URL:</strong>{" "}
                      <a
                        href={`${BASE_URL}/${viewBannerData.imageUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {viewBannerData.imageUrl}
                      </a>
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" my={2}>
                      <Avatar
                        src={`${BASE_URL}/${viewBannerData.imageUrl}`}
                        variant="square"
                        sx={{ width: "100%", maxWidth: 400, height: "auto" }}
                        alt="Banner Image"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Link:</strong>{" "}
                      {viewBannerData.link ? (
                        <a href={viewBannerData.link} target="_blank" rel="noopener noreferrer">
                          {viewBannerData.link}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Type:</strong> {getTypeChip(viewBannerData.type)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Position:</strong> {getPositionChip(viewBannerData.position)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewBannerData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Start Date:</strong>{" "}
                      {new Date(viewBannerData.startDate).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>End Date:</strong>{" "}
                      {new Date(viewBannerData.endDate).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewBannerData.created_at).toLocaleString()}
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

      {/* Edit Banner Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  value={editData.imageUrl}
                  onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-banner-upload"
                  type="file"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files.length > 0) {
                      const uploadedFiles = await handleFileUpload(files);
                      if (uploadedFiles && uploadedFiles.length > 0) {
                        setEditData({
                          ...editData,
                          imageUrl: uploadedFiles[0].path,
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="edit-banner-upload">
                  <Button variant="contained" component="span" startIcon={<AddIcon />}>
                    Upload New Image
                  </Button>
                </label>
                {editData.imageUrl && (
                  <Box mt={2}>
                    <Avatar
                      src={`${BASE_URL}/${editData.imageUrl}`}
                      variant="square"
                      sx={{ width: 200, height: 100 }}
                      alt="Banner Preview"
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Link"
                  fullWidth
                  margin="normal"
                  value={editData.link}
                  onChange={(e) => setEditData({ ...editData, link: e.target.value })}
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
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="promo">Promo</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={editData.position}
                    onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                    label="Position"
                    required
                  >
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={editData.startDate}
                  onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
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
                  value={editData.endDate}
                  onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateBanner} color="error" variant="contained">
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
              Are you sure you want to delete this banner? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteBanner} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Banner Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Banner</MDTypography>
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
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="create-banner-upload"
                  type="file"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files.length > 0) {
                      const uploadedFiles = await handleFileUpload(files);
                      if (uploadedFiles && uploadedFiles.length > 0) {
                        setNewBanner({
                          ...newBanner,
                          imageUrl: uploadedFiles[0].path,
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="create-banner-upload">
                  <Button variant="contained" component="span" startIcon={<AddIcon />}>
                    Upload Image
                  </Button>
                </label>
                {uploading && <CircularProgress size={24} />}
                {newBanner.imageUrl && (
                  <Box mt={2}>
                    <Avatar
                      src={`${BASE_URL}/${newBanner.imageUrl}`}
                      variant="square"
                      sx={{ width: 200, height: 100 }}
                      alt="Banner Preview"
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={newBanner.description}
                  onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Link"
                  fullWidth
                  margin="normal"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newBanner.type}
                    onChange={(e) => setNewBanner({ ...newBanner, type: e.target.value })}
                    label="Type"
                    required
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="promo">Promo</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={newBanner.position}
                    onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                    label="Position"
                    required
                  >
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newBanner.status}
                    onChange={(e) => setNewBanner({ ...newBanner, status: e.target.value })}
                    label="Status"
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newBanner.startDate}
                  onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
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
                  value={newBanner.endDate}
                  onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateBanner} color="error" variant="contained">
            Create Banner
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default Banners;
