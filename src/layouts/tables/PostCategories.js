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

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://branding.shellcode.website";

function PostCategories() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewCategoryData, setViewCategoryData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    category_name: "",
    category_details: "",
    category_image: [],
    status: "active",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    category_details: "",
    category_image: [],
    status: "active",
  });
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/post-categories?page=${page + 1}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid data structure from API");
      }

      // Process category images that might be stringified arrays
      const processedCategories = result.data.map((category) => {
        let images = [];
        try {
          if (category.category_image && category.category_image.startsWith("[")) {
            images = JSON.parse(category.category_image);
          } else if (category.category_image) {
            images = [category.category_image];
          }
        } catch (e) {
          console.error("Error parsing category images:", e);
          images = category.category_image ? [category.category_image] : [];
        }

        return {
          ...category,
          category_image: images,
        };
      });

      setCategories(processedCategories);
      setTotalCategories(result.total || processedCategories.length);
      setTotalPages(result.totalPages || Math.ceil(processedCategories.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching category data:", error);
      showSnackbar(error.message || "Error fetching categories", "error");
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

  const handleMultipleImageUpload = async (files) => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return [];
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const response = await fetch(`${BASE_URL}/api/upload/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      return data.files.map((file) => file.filename);
    } catch (error) {
      console.error("Error uploading images:", error);
      showSnackbar(error.message || "Error uploading images", "error");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleViewCategory = (category) => {
    setViewCategoryData(category);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (category) => {
    setEditData({
      id: category.id,
      category_name: category.category_name,
      category_details: category.category_details,
      category_image: Array.isArray(category.category_image)
        ? category.category_image
        : [category.category_image].filter(Boolean),
      status: category.status,
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

  const handleUpdateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const categoryData = {
        ...editData,
        category_image: JSON.stringify(editData.category_image),
      };

      const response = await fetch(`${BASE_URL}/api/post-categories/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      showSnackbar("Category updated successfully");
      setOpenEditDialog(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      showSnackbar(error.message || "Error updating category", "error");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/post-categories/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      showSnackbar("Category deleted successfully");
      setOpenDeleteDialog(false);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      showSnackbar(error.message || "Error deleting category", "error");
    }
  };

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const categoryData = {
        ...newCategory,
        category_image: JSON.stringify(newCategory.category_image),
      };

      const response = await fetch(`${BASE_URL}/api/post-categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      showSnackbar("Category created successfully");
      setOpenCreateDialog(false);
      setNewCategory({
        category_name: "",
        category_details: "",
        category_image: [],
        status: "active",
      });
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      showSnackbar(error.message || "Error creating category", "error");
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
    if (!value || value.length === 0)
      return <MDTypography variant="caption">No Image</MDTypography>;

    return (
      <Badge badgeContent={value.length > 1 ? value.length : 0} color="primary">
        <Avatar
          src={`${BASE_URL}/uploads/${value[0]}`}
          variant="rounded"
          sx={{ width: 80, height: 40 }}
          style={{ cursor: "pointer" }}
        />
      </Badge>
    );
  };

  ImageCell.propTypes = {
    value: PropTypes.array,
  };

  const PostsCell = ({ value = [] }) => (
    <Chip label={`${value?.length || 0} posts`} color="info" size="small" variant="outlined" />
  );

  PostsCell.propTypes = {
    value: PropTypes.array,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter((category) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      category.category_name.toLowerCase().includes(searchTermLower) ||
      (category.category_details &&
        category.category_details.toLowerCase().includes(searchTermLower)) ||
      category.id.toString().includes(searchTermLower)
    );
  });

  // ActionsCell component for action buttons in the table
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
              handleViewCategory(row.original);
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
              handleOpenEditDialog(row.original);
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
    { Header: "Name", accessor: "category_name" },
    {
      Header: "Details",
      accessor: "category_details",
      Cell: ({ value }) => value || "No details",
    },
    {
      Header: "Images",
      accessor: "category_image",
      Cell: ImageCell,
    },
    {
      Header: "Posts",
      accessor: "posts",
      Cell: PostsCell,
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
                    Post Categories Management
                  </MDTypography>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Search categories"
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
                      startIcon={<AddIcon />}
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
                      Create Category
                    </Button>
                  </Box>
                </MDBox>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{ columns, rows: filteredCategories }}
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
                  count={totalCategories}
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

      {/* Category Details View Dialog */}
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
            Category Details
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
          {viewCategoryData && (
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
                      <strong>ID:</strong> {viewCategoryData.id}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewCategoryData.category_name}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Details:</strong> {viewCategoryData.category_details || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Status:</strong> {getStatusChip(viewCategoryData.status)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Created At:</strong>{" "}
                      {new Date(viewCategoryData.created_at).toLocaleDateString()}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography>
                      <strong>Images:</strong> ({viewCategoryData.category_image?.length || 0})
                    </MDTypography>
                    {viewCategoryData.category_image?.length > 0 ? (
                      <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                        {viewCategoryData.category_image.map((image, index) => (
                          <Avatar
                            key={index}
                            src={`${BASE_URL}/uploads/${image}`}
                            variant="rounded"
                            sx={{ width: 100, height: 100 }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <MDTypography variant="caption">No images available</MDTypography>
                    )}
                  </Grid>
                </Grid>
              </MDBox>

              {viewCategoryData.posts?.length > 0 && (
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
                    <CheckCircleIcon fontSize="small" />
                    Associated Posts ({viewCategoryData.posts.length})
                  </MDTypography>
                  <Grid container spacing={2}>
                    {viewCategoryData.posts.map((post) => (
                      <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card sx={{ p: 2 }}>
                          <MDTypography variant="h6">{post.post_name}</MDTypography>
                          {post.post_image && (
                            <Box mt={2}>
                              <Avatar
                                src={`${BASE_URL}/uploads/${post.post_image}`}
                                variant="rounded"
                                sx={{ width: "100%", height: 100 }}
                              />
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              )}
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

      {/* Edit Category Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
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
          Edit Category
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7fafc" }}>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Category Name"
                  fullWidth
                  margin="normal"
                  value={editData.category_name}
                  onChange={(e) => setEditData({ ...editData, category_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Category Details"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={editData.category_details}
                  onChange={(e) => setEditData({ ...editData, category_details: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-category-upload"
                  type="file"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      const filenames = await handleMultipleImageUpload(files);
                      if (filenames.length > 0) {
                        setEditData({
                          ...editData,
                          category_image: [...editData.category_image, ...filenames],
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="edit-category-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CollectionsIcon />}
                    sx={{ mr: 2 }}
                  >
                    Add Images
                  </Button>
                </label>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditData({ ...editData, category_image: [] })}
                  disabled={editData.category_image.length === 0}
                >
                  Clear All
                </Button>
                {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                {editData.category_image.length > 0 && (
                  <Box mt={2}>
                    <MDTypography variant="caption">
                      {editData.category_image.length} image(s) selected
                    </MDTypography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {editData.category_image.map((image, index) => (
                        <Box key={index} position="relative">
                          <Avatar
                            src={`${BASE_URL}/uploads/${image}`}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                              },
                            }}
                            onClick={() => {
                              setEditData({
                                ...editData,
                                category_image: editData.category_image.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
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
        <DialogActions sx={{ backgroundColor: "#f7fafc", padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
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
            onClick={handleUpdateCategory}
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
            <MDTypography>
              Are you sure you want to delete this category? This action cannot be undone.
            </MDTypography>
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
            onClick={handleDeleteCategory}
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

      {/* Create Category Dialog */}
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
          Create New Category
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7fafc" }}>
          <MDBox mt={2} mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Category Name"
                  fullWidth
                  margin="normal"
                  value={newCategory.category_name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, category_name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Category Details"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={newCategory.category_details}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, category_details: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="create-category-upload"
                  type="file"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      const filenames = await handleMultipleImageUpload(files);
                      if (filenames.length > 0) {
                        setNewCategory({
                          ...newCategory,
                          category_image: [...newCategory.category_image, ...filenames],
                        });
                      }
                    }
                  }}
                />
                <label htmlFor="create-category-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CollectionsIcon />}
                    sx={{ mr: 2 }}
                  >
                    Add Images
                  </Button>
                </label>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setNewCategory({ ...newCategory, category_image: [] })}
                  disabled={newCategory.category_image.length === 0}
                >
                  Clear All
                </Button>
                {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                {newCategory.category_image.length > 0 && (
                  <Box mt={2}>
                    <MDTypography variant="caption">
                      {newCategory.category_image.length} image(s) selected
                    </MDTypography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {newCategory.category_image.map((image, index) => (
                        <Box key={index} position="relative">
                          <Avatar
                            src={`${BASE_URL}/uploads/${image}`}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                              },
                            }}
                            onClick={() => {
                              setNewCategory({
                                ...newCategory,
                                category_image: newCategory.category_image.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newCategory.status}
                    onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
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
            onClick={handleCreateCategory}
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
            Create Category
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

// Remove the following propTypes definition as it is incorrect and not needed here.
// PostCategories does not receive a "row" prop directly.
// If you want to define propTypes for the DataTable or its columns, do it in the DataTable component or for custom cell components.
// You can safely leave this section empty or remove it.

export default PostCategories;
