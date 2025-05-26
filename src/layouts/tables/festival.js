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
  CardMedia,
  Snackbar,
  Alert,
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
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://business-branding.synoventum.site";

function Festivals() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewFestivalData, setViewFestivalData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    festival_name: "",
    festival_date: new Date(),
    festival_image: "",
    status: "active",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newFestival, setNewFestival] = useState({
    festival_name: "",
    festival_date: new Date(),
    festival_image: "",
    status: "active",
  });
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchFestivals();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      let url = `${BASE_URL}/api/festivals`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch festivals");
      }

      const data = await response.json();
      setFestivals(data.data || []);
    } catch (error) {
      console.error("Error fetching festival data:", error);
      showSnackbar("Error fetching festivals", "error");
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
      return data.files[0].filename; // Return only the filename
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(error.message || "Error uploading file", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleViewFestival = (festival) => {
    setViewFestivalData(festival);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (festival) => {
    setEditData({
      id: festival.id,
      festival_name: festival.festival_name,
      festival_date: new Date(festival.festival_date),
      festival_image: festival.festival_image,
      status: festival.status,
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

  const handleUpdateFestival = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      // Format date to YYYY-MM-DD
      const formattedDate = editData.festival_date.toISOString().split("T")[0];

      const response = await fetch(`${BASE_URL}/api/festivals/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editData,
          festival_date: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update festival");
      }

      showSnackbar("Festival updated successfully");
      setOpenEditDialog(false);
      fetchFestivals();
    } catch (error) {
      console.error("Error updating festival:", error);
      showSnackbar(error.message || "Error updating festival", "error");
    }
  };

  const handleDeleteFestival = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/festivals/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete festival");
      }

      showSnackbar("Festival deleted successfully");
      setOpenDeleteDialog(false);
      fetchFestivals();
    } catch (error) {
      console.error("Error deleting festival:", error);
      showSnackbar(error.message || "Error deleting festival", "error");
    }
  };

  const handleCreateFestival = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      // Format date to YYYY-MM-DD
      const formattedDate = newFestival.festival_date.toISOString().split("T")[0];

      const response = await fetch(`${BASE_URL}/api/festivals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newFestival,
          festival_date: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create festival");
      }

      showSnackbar("Festival created successfully");
      setOpenCreateDialog(false);
      setNewFestival({
        festival_name: "",
        festival_date: new Date(),
        festival_image: "",
        status: "active",
      });
      fetchFestivals();
    } catch (error) {
      console.error("Error creating festival:", error);
      showSnackbar(error.message || "Error creating festival", "error");
    }
  };

  // Helper to render a Chip for festival status
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
      default:
        color = "default";
        label = status;
    }
    return <Chip label={label} color={color} size="small" />;
  }

  // Helper to render festival image
  function renderFestivalImage(filename) {
    if (!filename) return <MDTypography variant="caption">No Image</MDTypography>;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={`${BASE_URL}/uploads/${filename}`}
          variant="rounded"
          sx={{ width: 80, height: 40 }}
          style={{ cursor: "pointer" }}
        />
      </Box>
    );
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
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "festival_name" },
    {
      Header: "Date",
      accessor: "festival_date",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Image",
      accessor: "festival_image",
      Cell: ({ value }) => renderFestivalImage(value),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (cellProps) => (
        <ActionsColumnCell
          {...cellProps}
          onView={handleViewFestival}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDeleteDialog}
        />
      ),
    },
  ];

  const filteredFestivals = festivals
    .filter((festival) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        festival.festival_name.toLowerCase().includes(searchTermLower) ||
        festival.id.toString().includes(searchTermLower) ||
        new Date(festival.festival_date).toLocaleDateString().includes(searchTermLower)
      );
    })
    .filter((festival) => {
      if (statusFilter === "all") return true;
      return festival.status === statusFilter;
    });

  // Apply pagination
  const paginatedFestivals = filteredFestivals.slice(
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
                    Festivals Management
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
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Search festivals"
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
                      Create Festival
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: paginatedFestivals }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredFestivals.length}
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

      {/* Festival Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Festival Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewFestivalData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>ID:</strong> {viewFestivalData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewFestivalData.festival_name}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Date:</strong>{" "}
                      {new Date(viewFestivalData.festival_date).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Image:</strong> {viewFestivalData.festival_image || "No image"}
                    </MDTypography>
                  </Grid>
                  {viewFestivalData.festival_image && (
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center" my={2}>
                        <CardMedia
                          component="img"
                          image={`${BASE_URL}/uploads/${viewFestivalData.festival_image}`}
                          sx={{ width: "100%", maxWidth: 400, height: "auto" }}
                          alt="Festival Image"
                        />
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewFestivalData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewFestivalData.created_at).toLocaleString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Updated At:</strong>{" "}
                      {new Date(viewFestivalData.updated_at).toLocaleString()}
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

      {/* Edit Festival Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Festival</DialogTitle>
        <DialogContent>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Festival Name"
                  fullWidth
                  margin="normal"
                  value={editData.festival_name}
                  onChange={(e) => setEditData({ ...editData, festival_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Festival Date"
                    value={editData.festival_date}
                    onChange={(newValue) => {
                      setEditData({ ...editData, festival_date: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-festival-upload"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const filename = await handleFileUpload(file);
                      if (filename) {
                        setEditData({
                          ...editData,
                          festival_image: filename,
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="edit-festival-upload">
                  <Button variant="contained" component="span" startIcon={<AddIcon />}>
                    Upload New Image
                  </Button>
                </label>
                {uploading && <CircularProgress size={24} />}
                {editData.festival_image && (
                  <Box mt={2}>
                    <CardMedia
                      component="img"
                      image={`${BASE_URL}/uploads/${editData.festival_image}`}
                      sx={{ width: 200, height: 100 }}
                      alt="Festival Preview"
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateFestival} color="error" variant="contained">
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
              Are you sure you want to delete this festival? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteFestival} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Festival Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Create New Festival</MDTypography>
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
                  label="Festival Name"
                  fullWidth
                  margin="normal"
                  value={newFestival.festival_name}
                  onChange={(e) =>
                    setNewFestival({ ...newFestival, festival_name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Festival Date"
                    value={newFestival.festival_date}
                    onChange={(newValue) => {
                      setNewFestival({ ...newFestival, festival_date: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="create-festival-upload"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const filename = await handleFileUpload(file);
                      if (filename) {
                        setNewFestival({
                          ...newFestival,
                          festival_image: filename,
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="create-festival-upload">
                  <Button variant="contained" component="span" startIcon={<AddIcon />}>
                    Upload Image
                  </Button>
                </label>
                {uploading && <CircularProgress size={24} />}
                {newFestival.festival_image && (
                  <Box mt={2}>
                    <CardMedia
                      component="img"
                      image={`${BASE_URL}/uploads/${newFestival.festival_image}`}
                      sx={{ width: 200, height: 100 }}
                      alt="Festival Preview"
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newFestival.status}
                    onChange={(e) => setNewFestival({ ...newFestival, status: e.target.value })}
                    label="Status"
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateFestival} color="error" variant="contained">
            Create Festival
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

export default Festivals;
