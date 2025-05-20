import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Chip,
  CardMedia,
  Box,
  CircularProgress,
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
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://deardabba.shellcode.store";

function Vendors() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewVendorData, setViewVendorData] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/vendors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();
      setVendors(data.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      showSnackbar("Error fetching vendors", "error");
    } finally {
      setLoading(false);
    }
  };

  const openApproveConfirmation = (vendorId) => {
    setSelectedVendorId(vendorId);
    setOpenApproveDialog(true);
  };

  const openRejectConfirmation = (vendorId) => {
    setSelectedVendorId(vendorId);
    setOpenRejectDialog(true);
  };

  const handleViewVendor = (vendor) => {
    setViewVendorData(vendor);
    setOpenViewDialog(true);
  };

  const handleApproveVendor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/vendors/${selectedVendorId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve vendor");
      }

      const data = await response.json();
      showSnackbar("Vendor approved successfully");
      setOpenApproveDialog(false);
      fetchVendors();
    } catch (error) {
      console.error("Error approving vendor:", error);
      showSnackbar(error.message || "Error approving vendor", "error");
    }
  };

  const handleRejectVendor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("No token found, please login again", "error");
        navigate("/authentication/sign-in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/vendors/${selectedVendorId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject vendor");
      }

      const data = await response.json();
      showSnackbar("Vendor rejected successfully");
      setOpenRejectDialog(false);
      fetchVendors();
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      showSnackbar(error.message || "Error rejecting vendor", "error");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Chip label="Approved" color="success" size="small" />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const handleViewImage = (imageUrl) => {
    if (!imageUrl) return;
    setImageLoading(true);
    setCurrentImage(`${BASE_URL}/${imageUrl}`);
    setOpenImageDialog(true);
  };

  const handleDownloadImage = (imageUrl) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = `${BASE_URL}/${imageUrl}`;
    link.target = "_blank";
    link.download = imageUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderImageWithPreview = (imageUrl, altText = "Image") => {
    if (!imageUrl) return <MDTypography variant="caption">Not Available</MDTypography>;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={`${BASE_URL}/${imageUrl}`}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
          onClick={() => handleViewImage(imageUrl)}
          style={{ cursor: "pointer" }}
        />
        <Box>
          <IconButton onClick={() => handleViewImage(imageUrl)} size="small">
            <ImageIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDownloadImage(imageUrl)} size="small">
            <DownloadIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name", Cell: ({ value }) => value || "N/A" },
    // { Header: "Email", accessor: "email", Cell: ({ value }) => value || "N/A" },
    { Header: "Mobile Number", accessor: "mobile_number" },
    {
      Header: "Verified",
      accessor: "isVerified",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      Header: "Admin Verified",
      accessor: "isAdminVerified",
      Cell: ({ value }) => getStatusChip(value),
    },
    {
      Header: "Terms Accepted",
      accessor: "terms_accepted",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      Header: "Onboarding Completed",
      accessor: "onboarding_completed",
      Cell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => handleViewVendor(row.original)}
              color="info"
              size="medium"
              sx={{ padding: 1 }}
            >
              <VisibilityIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={row.original.isAdminVerified === "approved" ? "Approved" : "Approve"}>
            <IconButton
              onClick={() => openApproveConfirmation(row.original.id)}
              disabled={row.original.isAdminVerified === "approved"}
              color={row.original.isAdminVerified === "approved" ? "success" : "primary"}
              size="medium"
              sx={{ padding: 1 }}
            >
              {row.original.isAdminVerified === "approved" ? (
                <CheckCircleIcon sx={{ fontSize: 28 }} color="success" />
              ) : (
                <PendingIcon sx={{ fontSize: 28 }} color="success" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={row.original.isAdminVerified === "rejected" ? "Rejected" : "Reject"}>
            <IconButton
              onClick={() => openRejectConfirmation(row.original.id)}
              disabled={row.original.isAdminVerified === "rejected"}
              color="error"
              size="medium"
              sx={{ padding: 1 }}
            >
              {row.original.isAdminVerified === "rejected" ? (
                <CancelIcon sx={{ fontSize: 28 }} color="error" />
              ) : (
                <PendingIcon sx={{ fontSize: 28 }} color="error" />
              )}
            </IconButton>
          </Tooltip>
        </MDBox>
      ),
    },
  ];

  const filteredVendors = vendors.filter((vendor) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (vendor.name && vendor.name.toLowerCase().includes(searchTermLower)) ||
      (vendor.email && vendor.email.toLowerCase().includes(searchTermLower)) ||
      (vendor.mobile_number && vendor.mobile_number.toLowerCase().includes(searchTermLower))
    );
  });

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
                    Vendors
                  </MDTypography>
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <TextField
                      label="Search Vendors"
                      type="text"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        mr: 2,
                        width: { xs: "100%", sm: 200 },
                        [theme.breakpoints.down("sm")]: {
                          marginBottom: 2,
                        },
                      }}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: filteredVendors }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Vendor Details View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Vendor Details</MDTypography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {viewVendorData && (
            <MDBox>
              <MDBox mb={3}>
                <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Basic Information
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Name:</strong> {viewVendorData.name || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Email:</strong> {viewVendorData.email || "N/A"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Mobile:</strong> {viewVendorData.mobile_number}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Verified:</strong> {viewVendorData.isVerified ? "Yes" : "No"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Admin Status:</strong> {getStatusChip(viewVendorData.isAdminVerified)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography>
                      <strong>Onboarding Completed:</strong>{" "}
                      {viewVendorData.onboarding_completed ? "Yes" : "No"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>

              <Divider sx={{ my: 2 }} />

              {viewVendorData.businessInfo && (
                <MDBox mb={3}>
                  <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Business Information
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Owner Name:</strong> {viewVendorData.businessInfo.owner_full_name}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Restaurant Name:</strong>{" "}
                        {viewVendorData.businessInfo.restaurant_name}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Business Category:</strong>{" "}
                        {viewVendorData.businessInfo.business_category}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>WhatsApp Number:</strong>{" "}
                        {viewVendorData.businessInfo.whatsapp_number}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              )}

              <Divider sx={{ my: 2 }} />

              {viewVendorData.addressDetails && (
                <MDBox mb={3}>
                  <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Address Details
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Shop Number:</strong> {viewVendorData.addressDetails.shop_num}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Floor:</strong> {viewVendorData.addressDetails.floor}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Building Name:</strong>{" "}
                        {viewVendorData.addressDetails.building_complex_name}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Pincode:</strong> {viewVendorData.addressDetails.pincode}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Landmark:</strong> {viewVendorData.addressDetails.landmark}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      {/* <MDTypography>
                        <strong>Audio URL:</strong>{" "}
                        {viewVendorData.addressDetails.audio_url ? "Available" : "Not Available"}
                      </MDTypography> */}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Front Image:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.addressDetails.front_pic_url,
                          "Front View"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Right Angle Image:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.addressDetails.right_angle_pic_url,
                          "Right View"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Left Angle Image:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.addressDetails.left_angle_pic_url,
                          "Left View"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Kitchen Image:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.addressDetails.kitchen_pic_url,
                          "Kitchen View"
                        )}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              )}

              <Divider sx={{ my: 2 }} />

              {viewVendorData.legalDocs && (
                <MDBox mb={3}>
                  <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Legal Documents
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>PAN Number:</strong> {viewVendorData.legalDocs.pan_number}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>GSTIN:</strong> {viewVendorData.legalDocs.gstin || "N/A"}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Food Safety License:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.legalDocs.food_safety_license_url,
                          "Food Safety License"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Trade License:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.legalDocs.trade_license_url,
                          "Trade License"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Owner ID Proof:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.legalDocs.owner_id_proof_url,
                          "Owner ID Proof"
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDTypography>
                        <strong>Food Hygiene Cert:</strong>{" "}
                        {renderImageWithPreview(
                          viewVendorData.legalDocs.basic_food_hygiene_cert_url,
                          "Food Hygiene Certificate"
                        )}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              )}

              {viewVendorData.workingDays && viewVendorData.workingDays.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Working Hours
                    </MDTypography>
                    <Grid container spacing={2}>
                      {viewVendorData.workingDays.map((day, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <MDTypography>
                            <strong>{day.day.charAt(0).toUpperCase() + day.day.slice(1)}:</strong>{" "}
                            {formatTime(day.opening_time)} - {formatTime(day.closing_time)}
                          </MDTypography>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </>
              )}

              {viewVendorData.paymentInfo && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Payment Information
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Payment Type:</strong> {viewVendorData.paymentInfo.paymentType}
                        </MDTypography>
                      </Grid>
                      {viewVendorData.paymentInfo.paymentDetails && (
                        <>
                          <Grid item xs={12} md={6}>
                            <MDTypography>
                              <strong>Account Holder:</strong>{" "}
                              {viewVendorData.paymentInfo.paymentDetails.account_holder_name}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <MDTypography>
                              <strong>Account Number:</strong>{" "}
                              {viewVendorData.paymentInfo.paymentDetails.account_number}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <MDTypography>
                              <strong>IFSC Code:</strong>{" "}
                              {viewVendorData.paymentInfo.paymentDetails.ifsc_code}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <MDTypography>
                              <strong>Bank Name:</strong>{" "}
                              {viewVendorData.paymentInfo.paymentDetails.bank_name}
                            </MDTypography>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Payout Period:</strong> {viewVendorData.paymentInfo.payoutPeriod}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                </>
              )}

              {viewVendorData.branding && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Branding
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <MDTypography>
                          <strong>Brand Logo:</strong>{" "}
                          {renderImageWithPreview(
                            viewVendorData.branding.brandLogoUrl,
                            "Brand Logo"
                          )}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                </>
              )}

              {viewVendorData.onboardingSteps && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <MDBox mb={3}>
                    <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Onboarding Progress
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Menu Setup:</strong> {viewVendorData.onboardingSteps.menu_setup}/5
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Business Info:</strong>{" "}
                          {viewVendorData.onboardingSteps.business_information}/5
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Legal Documentation:</strong>{" "}
                          {viewVendorData.onboardingSteps.legal_documentation}/5
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Bank & Payment:</strong>{" "}
                          {viewVendorData.onboardingSteps.bank_and_payment_setup}/5
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography>
                          <strong>Branding:</strong> {viewVendorData.onboardingSteps.branding}/5
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                </>
              )}
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6">Image Preview</MDTypography>
            <IconButton onClick={() => setOpenImageDialog(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          {imageLoading && (
            <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </MDBox>
          )}
          <CardMedia
            component="img"
            image={currentImage}
            alt="Preview"
            sx={{
              maxHeight: "70vh",
              objectFit: "contain",
              display: imageLoading ? "none" : "block",
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            // startIcon={<DownloadIcon />}
            onClick={() => handleDownloadImage(currentImage.replace(BASE_URL + "/", ""))}
            variant="contained"
            color="error"
            sx={{ mr: 2 }}
          >
            see in tab
          </Button>
          <Button onClick={() => setOpenImageDialog(false)} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <MDTypography variant="body1">Are you sure you want to approve this vendor?</MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApproveVendor} color="success" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <MDTypography variant="body1">Are you sure you want to reject this vendor?</MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectVendor} color="error" variant="contained">
            Reject
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

Vendors.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      mobile_number: PropTypes.string.isRequired,
      isVerified: PropTypes.number,
      isAdminVerified: PropTypes.string,
      terms_accepted: PropTypes.number,
      onboarding_completed: PropTypes.number,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Vendors;
