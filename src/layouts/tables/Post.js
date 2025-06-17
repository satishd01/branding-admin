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
  Divider,
  Paper,
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

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Videocam as VideocamIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://business-branding.synoventum.site";

// Custom color palette with vibrant yet professional colors
const colors = {
  primary: "#5e72e4", // Vibrant blue
  secondary: "#f7fafc", // Light gray background
  success: "#2dce89", // Fresh green
  info: "#11cdef", // Bright cyan
  warning: "#fb6340", // Orange
  danger: "#f5365c", // Pinkish red
  light: "#f8f9fa",
  dark: "#212529",
  white: "#ffffff",
  textPrimary: "#32325d",
  textSecondary: "#525f7f",
  gradientPrimary: "linear-gradient(87deg, #5e72e4 0, #825ee4 100%)",
  gradientSuccess: "linear-gradient(87deg, #2dce89 0, #2dcecc 100%)",
  gradientDanger: "linear-gradient(87deg, #f5365c 0, #f56036 100%)",
  gradientInfo: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
};

function Posts() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [postTypeFilter, setPostTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewPostData, setViewPostData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    post_name: "",
    category_id: "",
    post_image: "",
    posttype: "image",
    status: "active",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    post_name: "",
    category_id: "",
    post_image: "",
    posttype: "image",
  });
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Error fetching post data:", error);
      showSnackbar("Error fetching posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/post-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showSnackbar("Error fetching categories", "error");
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

  const handleViewPost = (post) => {
    setViewPostData(post);
    setOpenViewDialog(true);
  };

  const handleOpenEditDialog = (post) => {
    setEditData({
      id: post.id,
      post_name: post.post_name,
      category_id: post.category_id || "",
      post_image: post.post_image,
      posttype: post.posttype || "image",
      status: post.status || "active",
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

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_name: editData.post_name,
          category_id: editData.category_id || null,
          post_image: editData.post_image,
          posttype: editData.posttype,
          status: editData.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      showSnackbar("Post updated successfully");
      setOpenEditDialog(false);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      showSnackbar(error.message || "Error updating post", "error");
    }
  };

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      showSnackbar("Post deleted successfully");
      setOpenDeleteDialog(false);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      showSnackbar(error.message || "Error deleting post", "error");
    }
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_name: newPost.post_name,
          category_id: newPost.category_id || null,
          post_image: newPost.post_image,
          posttype: newPost.posttype,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      showSnackbar("Post created successfully");
      setOpenCreateDialog(false);
      setNewPost({
        post_name: "",
        category_id: "",
        post_image: "",
        posttype: "image",
      });
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar(error.message || "Error creating post", "error");
    }
  };

  // Helper to render a Chip for post status
  function getStatusChip(status) {
    let color = "default";
    let label = status;
    switch (status) {
      case "active":
        color = "success";
        label = "Active";
        break;
      case "inactive":
        color = "danger";
        label = "Inactive";
        break;
      default:
        color = "default";
        label = status;
    }
    return (
      <Chip
        label={label}
        sx={{
          background: status === "active" ? colors.gradientSuccess : colors.gradientDanger,
          color: colors.white,
          fontWeight: "bold",
          fontSize: "0.7rem",
          height: "24px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      />
    );
  }

  // Helper to render post type
  function getPostTypeChip(type) {
    return (
      <Chip
        label={type === "video" ? "Video" : "Image"}
        icon={type === "video" ? <VideocamIcon fontSize="small" /> : <ImageIcon fontSize="small" />}
        sx={{
          background: type === "video" ? colors.gradientInfo : colors.gradientPrimary,
          color: colors.white,
          fontWeight: "bold",
          fontSize: "0.7rem",
          height: "24px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      />
    );
  }

  // Helper to render post image or video
  function renderPostMedia(filename, type) {
    if (!filename) return <MDTypography variant="caption">No Media</MDTypography>;

    if (type === "video") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <VideocamIcon color="primary" />
          <MDTypography variant="caption" color={colors.primary}>
            Video File
          </MDTypography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={`${BASE_URL}/uploads/${filename}`}
          variant="rounded"
          sx={{
            width: 80,
            height: 40,
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              cursor: "pointer",
            },
          }}
          onClick={() => window.open(`${BASE_URL}/uploads/${filename}`, "_blank")}
        />
      </Box>
    );
  }

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
          sx={{
            color: colors.primary,
            "&:hover": {
              backgroundColor: "rgba(94, 114, 228, 0.1)",
            },
          }}
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
          PaperProps={{
            style: {
              minWidth: "160px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.05)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onView(row.original);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(17, 205, 239, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" sx={{ color: colors.info }} />
            </ListItemIcon>
            <ListItemText
              primary="View"
              primaryTypographyProps={{ color: colors.textPrimary, fontSize: "0.875rem" }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit(row.original);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(94, 114, 228, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: colors.primary }} />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ color: colors.textPrimary, fontSize: "0.875rem" }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete(row.original.id);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(245, 54, 92, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: colors.danger }} />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              primaryTypographyProps={{ color: colors.textPrimary, fontSize: "0.875rem" }}
            />
          </MenuItem>
        </Menu>
      </>
    );
  }

  ActionsColumnCell.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  function IdCell({ value }) {
    return (
      <MDTypography variant="caption" color={colors.textPrimary} fontWeight="medium">
        {value}
      </MDTypography>
    );
  }
  IdCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  function NameCell({ value }) {
    return (
      <MDTypography variant="caption" color={colors.textPrimary} fontWeight="medium">
        {value}
      </MDTypography>
    );
  }
  NameCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  function MediaCell({ value, row }) {
    return renderPostMedia(value, row.original.posttype);
  }
  MediaCell.propTypes = {
    value: PropTypes.string,
    row: PropTypes.object.isRequired,
  };

  function TypeCell({ value }) {
    return getPostTypeChip(value);
  }
  TypeCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  function StatusCell({ value }) {
    return getStatusChip(value);
  }
  StatusCell.propTypes = {
    value: PropTypes.string.isRequired,
  };

  function CategoryCell({ value, row }) {
    return (
      <MDTypography variant="caption" color={colors.textPrimary}>
        {row.original.category?.category_name || "No Category"}
      </MDTypography>
    );
  }
  CategoryCell.propTypes = {
    value: PropTypes.any,
    row: PropTypes.object.isRequired,
  };

  function CreatedAtCell({ value }) {
    return (
      <MDTypography variant="caption" color={colors.textSecondary}>
        {new Date(value).toLocaleDateString()}
      </MDTypography>
    );
  }
  CreatedAtCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      width: "5%",
      Cell: IdCell,
    },
    {
      Header: "Name",
      accessor: "post_name",
      width: "20%",
      Cell: NameCell,
    },
    {
      Header: "Media",
      accessor: "post_image",
      Cell: MediaCell,
      width: "15%",
    },
    {
      Header: "Type",
      accessor: "posttype",
      Cell: TypeCell,
      width: "10%",
    },
    {
      Header: "Category",
      accessor: "category_id",
      Cell: CategoryCell,
      width: "15%",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: StatusCell,
      width: "10%",
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: CreatedAtCell,
      width: "15%",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (cellProps) => (
        <ActionsColumnCell
          {...cellProps}
          onView={handleViewPost}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDeleteDialog}
        />
      ),
      width: "20%",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      post.post_name.toLowerCase().includes(searchTermLower) ||
      post.id.toString().includes(searchTermLower);
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesType = postTypeFilter === "all" || post.posttype === postTypeFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category_id?.toString() === categoryFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  // Apply pagination
  const paginatedPosts = filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: colors.primary,
              animationDuration: "800ms",
            }}
          />
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
                  background: colors.gradientPrimary,
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
                    color={colors.white}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Posts Management
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel
                        sx={{
                          color: colors.white,
                          "&.Mui-focused": {
                            color: colors.white,
                          },
                        }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                        sx={{
                          width: 150,
                          height: 36,
                          color: colors.white,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.5)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.75)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.white,
                          },
                          "& .MuiSvgIcon-root": {
                            color: colors.white,
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: "8px",
                              marginTop: "8px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel
                        sx={{
                          color: colors.white,
                          "&.Mui-focused": {
                            color: colors.white,
                          },
                        }}
                      >
                        Type
                      </InputLabel>
                      <Select
                        value={postTypeFilter}
                        onChange={(e) => setPostTypeFilter(e.target.value)}
                        label="Type"
                        sx={{
                          width: 150,
                          height: 36,
                          color: colors.white,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.5)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.75)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.white,
                          },
                          "& .MuiSvgIcon-root": {
                            color: colors.white,
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: "8px",
                              marginTop: "8px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                      </Select>
                    </FormControl>
                    {/* Category filter removed */}
                    <TextField
                      label="Search posts..."
                      type="text"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        width: { xs: "100%", sm: 200 },
                        [theme.breakpoints.down("sm")]: {
                          marginBottom: 2,
                        },
                        "& .MuiInputBase-input": {
                          color: colors.white,
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
                            borderColor: colors.white,
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
                        background: colors.gradientSuccess,
                        "&:hover": {
                          background: "linear-gradient(87deg, #2dce89 0, #2dce89 100%)",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                        height: 36,
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        padding: "8px 16px",
                        minWidth: "140px",
                      }}
                    >
                      New Post
                    </Button>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3} px={2}>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <DataTable
                    table={{
                      columns,
                      rows: paginatedPosts.map((post) => ({
                        ...post,
                        created_at: new Date(post.created_at).toLocaleDateString(),
                      })),
                    }}
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
                          backgroundColor: colors.secondary,
                          color: colors.textPrimary,
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
                    count={filteredPosts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        color: colors.textSecondary,
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </Paper>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Post Details View Dialog */}
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
            background: colors.gradientPrimary,
            color: colors.white,
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" color={colors.white}>
            Post Details
          </MDTypography>
          <IconButton
            onClick={() => setOpenViewDialog(false)}
            sx={{
              color: colors.white,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.secondary }}>
          {viewPostData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                  Post Information
                </MDTypography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        ID
                      </MDTypography>
                      <MDTypography variant="body2" color={colors.textPrimary}>
                        {viewPostData.id}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        Name
                      </MDTypography>
                      <MDTypography variant="body2" color={colors.textPrimary}>
                        {viewPostData.post_name}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        \ Type
                      </MDTypography>
                      {getPostTypeChip(viewPostData.posttype)}
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        Status
                      </MDTypography>
                      {getStatusChip(viewPostData.status || "active")}
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        Category
                      </MDTypography>
                      <MDTypography variant="body2" color={colors.textPrimary}>
                        {viewPostData.category?.category_name || "No Category"}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        {viewPostData.posttype === "video" ? "Video Preview" : "Image Preview"}
                      </MDTypography>
                      <Box
                        display="flex"
                        justifyContent="center"
                        my={2}
                        sx={{
                          border: "1px dashed rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                          padding: "16px",
                          backgroundColor: colors.white,
                        }}
                      >
                        {viewPostData.posttype === "video" ? (
                          <Box
                            sx={{
                              width: "100%",
                              maxWidth: 400,
                              height: "auto",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                          >
                            <video
                              controls
                              src={`${BASE_URL}/uploads/${viewPostData.post_image}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        ) : (
                          <CardMedia
                            component="img"
                            image={`${BASE_URL}/uploads/${viewPostData.post_image}`}
                            sx={{
                              width: "100%",
                              maxWidth: 400,
                              height: "auto",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                            alt="Post Image"
                          />
                        )}
                      </Box>
                      <Box display="flex" justifyContent="center" mt={2}>
                        <IconButton
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `${BASE_URL}/uploads/${viewPostData.post_image}`;
                            link.download = viewPostData.post_image;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          sx={{
                            background: colors.gradientSuccess,
                            color: colors.white,
                            "&:hover": {
                              background: "linear-gradient(87deg, #2dce89 0, #2dce89 100%)",
                            },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        Created At
                      </MDTypography>
                      <MDTypography variant="body2" color={colors.textPrimary}>
                        {new Date(viewPostData.created_at).toLocaleDateString()}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography
                        variant="caption"
                        color={colors.textSecondary}
                        fontWeight="bold"
                        display="block"
                        mb={0.5}
                      >
                        Updated At
                      </MDTypography>
                      <MDTypography variant="body2" color={colors.textPrimary}>
                        {new Date(viewPostData.updated_at).toLocaleDateString()}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.secondary, padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenViewDialog(false)}
            variant="contained"
            sx={{
              background: colors.gradientDanger,
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

      {/* Edit Post Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
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
            background: colors.gradientInfo,
            color: colors.white,
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" color={colors.white}>
            Edit Post
          </MDTypography>
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{
              color: colors.white,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.secondary }}>
          <MDBox mt={3} mb={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Post Name"
                  fullWidth
                  margin="normal"
                  value={editData.post_name}
                  onChange={(e) => setEditData({ ...editData, post_name: e.target.value })}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary,
                        boxShadow: `0 0 0 2px ${colors.primary}20`,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Post Type</InputLabel>
                  <Select
                    value={editData.posttype}
                    onChange={(e) => setEditData({ ...editData, posttype: e.target.value })}
                    label="Post Type"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editData.category_id || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, category_id: e.target.value || null })
                    }
                    label="Category"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">No Category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MDBox mt={2} mb={1}>
                  <MDTypography
                    variant="caption"
                    color={colors.textSecondary}
                    fontWeight="bold"
                    display="block"
                    mb={1}
                  >
                    {editData.posttype === "video" ? "Video File" : "Post Image"}
                  </MDTypography>
                  <input
                    accept={editData.posttype === "video" ? "video/*" : "image/*"}
                    style={{ display: "none" }}
                    id="edit-post-upload"
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const filename = await handleFileUpload(file);
                        if (filename) {
                          setEditData({
                            ...editData,
                            post_image: filename,
                          });
                        }
                      }
                    }}
                  />
                  <label htmlFor="edit-post-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        background: colors.gradientPrimary,
                        "&:hover": {
                          background: "linear-gradient(87deg, #5e72e4 0, #5e72e4 100%)",
                        },
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      Upload {editData.posttype === "video" ? "Video" : "Image"}
                    </Button>
                  </label>
                  {uploading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: colors.primary,
                        ml: 2,
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MDBox>
                {editData.post_image && (
                  <Box mt={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        display: "inline-block",
                        padding: "8px",
                        border: "1px dashed rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        backgroundColor: colors.white,
                      }}
                    >
                      {editData.posttype === "video" ? (
                        <Box
                          sx={{
                            width: 200,
                            height: 100,
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.05)",
                          }}
                        >
                          <VideocamIcon fontSize="large" color="primary" />
                        </Box>
                      ) : (
                        <CardMedia
                          component="img"
                          image={`${BASE_URL}/uploads/${editData.post_image}`}
                          sx={{
                            width: 200,
                            height: 100,
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          }}
                          alt="Post Preview"
                        />
                      )}
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.secondary, padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{
              color: colors.textSecondary,
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
            onClick={handleUpdatePost}
            variant="contained"
            sx={{
              background: colors.gradientSuccess,
              "&:hover": {
                background: "linear-gradient(87deg, #2dce89 0, #2dce89 100%)",
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
            background: colors.gradientDanger,
            color: colors.white,
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" color={colors.white}>
            Confirm Delete
          </MDTypography>
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: colors.white,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.secondary }}>
          <MDBox mt={3} mb={2}>
            <MDTypography
              variant="body1"
              color={colors.textPrimary}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DeleteIcon color="error" />
              Are you sure you want to delete this post? This action cannot be undone.
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.secondary, padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: colors.textSecondary,
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
            onClick={handleDeletePost}
            variant="contained"
            sx={{
              background: colors.gradientDanger,
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

      {/* Create Post Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
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
            background: colors.gradientSuccess,
            color: colors.white,
            padding: "16px 24px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" color={colors.white}>
            Create New Post
          </MDTypography>
          <IconButton
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              color: colors.white,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: colors.secondary }}>
          <MDBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Post Name"
                  fullWidth
                  margin="normal"
                  value={newPost.post_name}
                  onChange={(e) => setNewPost({ ...newPost, post_name: e.target.value })}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary,
                        boxShadow: `0 0 0 2px ${colors.primary}20`,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Post Type</InputLabel>
                  <Select
                    value={newPost.posttype}
                    onChange={(e) => setNewPost({ ...newPost, posttype: e.target.value })}
                    label="Post Type"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newPost.category_id || ""}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category_id: e.target.value || null })
                    }
                    label="Category"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}20`,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">No Category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MDBox mt={2} mb={1}>
                  <MDTypography
                    variant="caption"
                    color={colors.textSecondary}
                    fontWeight="bold"
                    display="block"
                    mb={1}
                  >
                    {newPost.posttype === "video" ? "Video File" : "Post Image"}
                  </MDTypography>
                  <input
                    accept={newPost.posttype === "video" ? "video/*" : "image/*"}
                    style={{ display: "none" }}
                    id="create-post-upload"
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const filename = await handleFileUpload(file);
                        if (filename) {
                          setNewPost({
                            ...newPost,
                            post_image: filename,
                          });
                        }
                      }
                    }}
                  />
                  <label htmlFor="create-post-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        background: colors.gradientPrimary,
                        "&:hover": {
                          background: "linear-gradient(87deg, #5e72e4 0, #5e72e4 100%)",
                        },
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      Upload {newPost.posttype === "video" ? "Video" : "Image"}
                    </Button>
                  </label>
                  {uploading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: colors.primary,
                        ml: 2,
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MDBox>
                {newPost.post_image && (
                  <Box mt={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        display: "inline-block",
                        padding: "8px",
                        border: "1px dashed rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        backgroundColor: colors.white,
                      }}
                    >
                      {newPost.posttype === "video" ? (
                        <Box
                          sx={{
                            width: 200,
                            height: 100,
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.05)",
                          }}
                        >
                          <VideocamIcon fontSize="large" color="primary" />
                        </Box>
                      ) : (
                        <CardMedia
                          component="img"
                          image={`${BASE_URL}/uploads/${newPost.post_image}`}
                          sx={{
                            width: 200,
                            height: 100,
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          }}
                          alt="Post Preview"
                        />
                      )}
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.secondary, padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              color: colors.textSecondary,
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
            onClick={handleCreatePost}
            variant="contained"
            sx={{
              background: colors.gradientSuccess,
              "&:hover": {
                background: "linear-gradient(87deg, #2dce89 0, #2dce89 100%)",
              },
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ml: 2,
            }}
          >
            Create Post
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
            error: <DeleteIcon fontSize="inherit" />,
            warning: <DeleteIcon fontSize="inherit" />,
            info: <DeleteIcon fontSize="inherit" />,
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

export default Posts;
