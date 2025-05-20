// import { useEffect, useState } from "react";
// import {
//   IconButton,
//   Tooltip,
//   Divider,
//   Box,
//   CircularProgress,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   TablePagination,
//   Menu,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Snackbar,
//   Alert,
//   TextField,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "@mui/material/styles";
// import PropTypes from "prop-types";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import PendingIcon from "@mui/icons-material/Pending";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CloseIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import DoneAllIcon from "@mui/icons-material/DoneAll";

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://traveller-api.synoventum.site";

// function Disputemanagement() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [Disputes, setDisputes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("pending");
//   const [typeFilter, setTypeFilter] = useState("payment");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [viewDisputeData, setViewDisputeData] = useState(null);
//   const [openStatusDialog, setOpenStatusDialog] = useState(false);
//   const [statusData, setStatusData] = useState({
//     id: null,
//     status: "pending",
//     adminRemarks: "",
//     resolution: "",
//   });
//   const [openCreateDialog, setOpenCreateDialog] = useState(false);
//   const [createDisputeData, setCreateDisputeData] = useState({
//     complainantId: "",
//     complainantType: "user",
//     respondentId: "",
//     respondentType: "host",
//     rideId: "",
//     disputeType: "payment",
//     description: "",
//     evidenceUrls: [],
//   });

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => {
//     fetchDisputes();
//   }, [statusFilter, typeFilter, startDate, endDate]);

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const fetchDisputes = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         showSnackbar("No token found, please login again", "error");
//         navigate("/authentication/sign-in");
//         return;
//       }

//       const query = new URLSearchParams({
//         type: typeFilter,
//         status: statusFilter,
//         startDate: startDate,
//         endDate: endDate,
//       });

//       const response = await fetch(`${BASE_URL}/v1/admin/disputes?${query}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch Disputes");
//       }

//       const data = await response.json();
//       setDisputes(data.data);
//       setPage(0); // Reset to first page when data changes
//     } catch (error) {
//       console.error("Error fetching Disputes data:", error);
//       showSnackbar("Error fetching Disputes", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDispute = (dispute) => {
//     setViewDisputeData(dispute);
//     setOpenViewDialog(true);
//   };

//   const handleOpenStatusDialog = (dispute) => {
//     setStatusData({
//       id: dispute.id,
//       status: dispute.status || "pending",
//       adminRemarks: dispute.adminRemarks || "",
//       resolution: dispute.resolution || "",
//     });
//     setOpenStatusDialog(true);
//   };

//   const handleUpdateStatus = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         showSnackbar("No token found, please login again", "error");
//         navigate("/authentication/sign-in");
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/v1/admin/disputes/${statusData.id}/status`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: statusData.status,
//           adminRemarks: statusData.adminRemarks,
//           resolution: statusData.resolution,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update Dispute status");
//       }

//       showSnackbar("Dispute status updated successfully");
//       setOpenStatusDialog(false);
//       fetchDisputes();
//     } catch (error) {
//       console.error("Error updating Dispute status:", error);
//       showSnackbar(error.message || "Error updating Dispute status", "error");
//     }
//   };

//   const handleCreateDispute = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         showSnackbar("No token found, please login again", "error");
//         navigate("/authentication/sign-in");
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/v1/admin/disputes`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(createDisputeData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create Dispute");
//       }

//       showSnackbar("Dispute created successfully");
//       setOpenCreateDialog(false);
//       fetchDisputes();
//     } catch (error) {
//       console.error("Error creating Dispute:", error);
//       showSnackbar(error.message || "Error creating Dispute", "error");
//     }
//   };

//   const getStatusChip = (status) => {
//     switch (status) {
//       case "confirmed":
//         return <Chip label="Confirmed" color="success" size="small" icon={<CheckCircleIcon />} />;
//       case "pending":
//         return <Chip label="Pending" color="warning" size="small" icon={<PendingIcon />} />;
//       case "in-progress":
//         return <Chip label="In Progress" color="info" size="small" icon={<AccessTimeIcon />} />;
//       case "resolved":
//         return <Chip label="Resolved" color="primary" size="small" icon={<DoneAllIcon />} />;
//       case "closed":
//         return <Chip label="Closed" color="error" size="small" icon={<CancelIcon />} />;
//       default:
//         return <Chip label={status} size="small" />;
//     }
//   };

//   const getDisputeTypeChip = (type) => {
//     switch (type) {
//       case "payment":
//         return <Chip label="Payment" color="success" size="small" />;
//       case "service":
//         return <Chip label="Service" color="warning" size="small" />;
//       case "behavior":
//         return <Chip label="Behavior" color="info" size="small" />;
//       case "safety":
//         return <Chip label="Safety" color="primary" size="small" />;
//       case "other":
//         return <Chip label="Other" color="error" size="small" />;
//       default:
//         return <Chip label={type} size="small" />;
//     }
//   };

//   const columns = [
//     { Header: "Dispute ID", accessor: "id" },
//     {
//       Header: "Type",
//       accessor: "disputeType",
//       Cell: ({ value }) => getDisputeTypeChip(value),
//     },
//     {
//       Header: "Description",
//       accessor: "description",
//       Cell: ({ value }) => (
//         <MDTypography variant="caption" noWrap sx={{ maxWidth: "150px" }}>
//           {value}
//         </MDTypography>
//       ),
//     },
//     {
//       Header: "Status",
//       accessor: "status",
//       Cell: ({ value }) => getStatusChip(value),
//     },
//     {
//       Header: "Actions",
//       accessor: "actions",
//       Cell: ({ row }) => {
//         const [anchorEl, setAnchorEl] = useState(null);
//         const open = Boolean(anchorEl);

//         const handleClick = (event) => {
//           setAnchorEl(event.currentTarget);
//         };

//         const handleClose = () => {
//           setAnchorEl(null);
//         };

//         return (
//           <Box>
//             <Tooltip title="View Details">
//               <IconButton onClick={() => handleViewDispute(row.original)}>
//                 <VisibilityIcon color="info" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="More actions">
//               <IconButton
//                 onClick={handleClick}
//                 aria-controls={open ? "actions-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? "true" : undefined}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//             </Tooltip>
//             <Menu
//               anchorEl={anchorEl}
//               id="actions-menu"
//               open={open}
//               onClose={handleClose}
//               onClick={handleClose}
//               PaperProps={{
//                 elevation: 0,
//                 sx: {
//                   overflow: "visible",
//                   filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//                   mt: 1.5,
//                   "& .MuiAvatar-root": {
//                     width: 32,
//                     height: 32,
//                     ml: -0.5,
//                     mr: 1,
//                   },
//                   "&:before": {
//                     content: '""',
//                     display: "block",
//                     position: "absolute",
//                     top: 0,
//                     right: 14,
//                     width: 10,
//                     height: 10,
//                     bgcolor: "background.paper",
//                     transform: "translateY(-50%) rotate(45deg)",
//                     zIndex: 0,
//                   },
//                 },
//               }}
//               transformOrigin={{ horizontal: "right", vertical: "top" }}
//               anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//             >
//               <MenuItem onClick={() => handleOpenStatusDialog(row.original)}>
//                 <ListItemIcon>
//                   <EditIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>Update Status</ListItemText>
//               </MenuItem>
//             </Menu>
//           </Box>
//         );
//       },
//     },
//   ];

//   const filteredDisputes = Disputes.filter((dispute) => {
//     const searchTermLower = searchTerm.toLowerCase();
//     return (
//       (dispute.id && dispute.id.toString().includes(searchTermLower)) ||
//       (dispute.description && dispute.description.toLowerCase().includes(searchTermLower)) ||
//       (dispute.disputeType && dispute.disputeType.toLowerCase().includes(searchTermLower))
//     );
//   });

//   // Apply pagination
//   const paginatedDisputes = filteredDisputes.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox pt={6} pb={3} display="flex" justifyContent="center">
//           <CircularProgress />
//         </MDBox>
//         <Footer />
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="white"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDBox
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   flexWrap="wrap"
//                 >
//                   <MDTypography variant="h6" color="black">
//                     Disputes
//                   </MDTypography>
//                   <MDBox display="flex" gap={2} flexWrap="wrap">
//                     <FormControl sx={{ minWidth: 120 }} size="small">
//                       <InputLabel>Status</InputLabel>
//                       <Select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         label="Status"
//                         sx={{
//                           width: 200,
//                           height: 35,
//                         }}
//                       >
//                         <MenuItem value="pending">Pending</MenuItem>
//                         <MenuItem value="confirmed">Confirmed</MenuItem>
//                         <MenuItem value="in-progress">In Progress</MenuItem>
//                         <MenuItem value="resolved">Resolved</MenuItem>
//                         <MenuItem value="closed">Closed</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <FormControl sx={{ minWidth: 120 }} size="small">
//                       <InputLabel>Type</InputLabel>
//                       <Select
//                         value={typeFilter}
//                         onChange={(e) => setTypeFilter(e.target.value)}
//                         label="Type"
//                         sx={{
//                           width: 200,
//                           height: 35,
//                         }}
//                       >
//                         <MenuItem value="payment">Payment</MenuItem>
//                         <MenuItem value="service">Service</MenuItem>
//                         <MenuItem value="behavior">Behavior</MenuItem>
//                         <MenuItem value="safety">Safety</MenuItem>
//                         <MenuItem value="other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <TextField
//                       label="Start Date"
//                       type="date"
//                       fullWidth
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       sx={{
//                         width: { xs: "100%", sm: 200 },
//                         [theme.breakpoints.down("sm")]: {
//                           marginBottom: 2,
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="End Date"
//                       type="date"
//                       fullWidth
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       sx={{
//                         width: { xs: "100%", sm: 200 },
//                         [theme.breakpoints.down("sm")]: {
//                           marginBottom: 2,
//                         },
//                       }}
//                     />
//                     <TextField
//                       label="Search Disputes"
//                       type="text"
//                       fullWidth
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       sx={{
//                         width: { xs: "100%", sm: 200 },
//                         [theme.breakpoints.down("sm")]: {
//                           marginBottom: 2,
//                         },
//                       }}
//                     />
//                     {/* <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => setOpenCreateDialog(true)}
//                     >
//                       Create Dispute
//                     </Button> */}
//                   </MDBox>
//                 </MDBox>
//               </MDBox>
//               <MDBox pt={3}>
//                 <DataTable
//                   table={{ columns, rows: paginatedDisputes }}
//                   isSorted={false}
//                   entriesPerPage={false}
//                   showTotalEntries={false}
//                   noEndBorder
//                 />
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={filteredDisputes.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={(event, newPage) => setPage(newPage)}
//                   onRowsPerPageChange={(event) => {
//                     setRowsPerPage(parseInt(event.target.value, 10));
//                     setPage(0);
//                   }}
//                 />
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>

//       {/* Dispute Details View Dialog */}
//       <Dialog
//         open={openViewDialog}
//         onClose={() => setOpenViewDialog(false)}
//         maxWidth="md"
//         fullWidth
//         scroll="paper"
//       >
//         <DialogTitle>
//           <MDBox display="flex" justifyContent="space-between" alignItems="center">
//             <MDTypography variant="h5">Dispute Details</MDTypography>
//             <IconButton onClick={() => setOpenViewDialog(false)}>
//               <CloseIcon />
//             </IconButton>
//           </MDBox>
//         </DialogTitle>
//         <DialogContent dividers>
//           {viewDisputeData && (
//             <MDBox>
//               <MDBox mb={3}>
//                 <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Basic Information
//                 </MDTypography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Dispute ID:</strong> {viewDisputeData.id}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Status:</strong> {getStatusChip(viewDisputeData.status)}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Type:</strong> {getDisputeTypeChip(viewDisputeData.disputeType)}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Description:</strong> {viewDisputeData.description}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <MDTypography>
//                       <strong>Evidence URLs:</strong>
//                       <ul>
//                         {viewDisputeData.evidenceUrls.map((url, index) => (
//                           <li key={index}>{url}</li>
//                         ))}
//                       </ul>
//                     </MDTypography>
//                   </Grid>
//                 </Grid>
//               </MDBox>

//               <Divider sx={{ my: 2 }} />

//               <MDBox mb={3}>
//                 <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Complainant Information
//                 </MDTypography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Name:</strong> {viewDisputeData.complainant?.name || "N/A"}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Phone:</strong> {viewDisputeData.complainant?.phoneNumber || "N/A"}
//                     </MDTypography>
//                   </Grid>
//                 </Grid>
//               </MDBox>

//               <Divider sx={{ my: 2 }} />

//               <MDBox mb={3}>
//                 <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Respondent Information
//                 </MDTypography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Name:</strong> {viewDisputeData.respondent?.name || "N/A"}
//                     </MDTypography>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <MDTypography>
//                       <strong>Phone:</strong> {viewDisputeData.respondent?.mobileNumber || "N/A"}
//                     </MDTypography>
//                   </Grid>
//                 </Grid>
//               </MDBox>

//               {viewDisputeData.adminRemarks && (
//                 <>
//                   <Divider sx={{ my: 2 }} />
//                   <MDBox mb={3}>
//                     <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                       Admin Remarks
//                     </MDTypography>
//                     <MDTypography>
//                       <strong>Remarks:</strong> {viewDisputeData.adminRemarks}
//                     </MDTypography>
//                   </MDBox>
//                 </>
//               )}

//               {viewDisputeData.resolution && (
//                 <>
//                   <Divider sx={{ my: 2 }} />
//                   <MDBox mb={3}>
//                     <MDTypography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                       Resolution
//                     </MDTypography>
//                     <MDTypography>
//                       <strong>Resolution:</strong> {viewDisputeData.resolution}
//                     </MDTypography>
//                   </MDBox>
//                 </>
//               )}
//             </MDBox>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenViewDialog(false)} variant="contained" color="error">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Status Update Dialog */}
//       <Dialog
//         open={openStatusDialog}
//         onClose={() => setOpenStatusDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Update Dispute Status</DialogTitle>
//         <DialogContent>
//           <MDBox mt={2} mb={3}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//                 label="Status"
//                 sx={{
//                   width: 300,
//                   height: 35,
//                 }}
//               >
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="confirmed">Confirmed</MenuItem>
//                 <MenuItem value="in-progress">In Progress</MenuItem>
//                 <MenuItem value="resolved">Resolved</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </Select>
//             </FormControl>
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Admin Remarks"
//               type="text"
//               fullWidth
//               value={statusData.adminRemarks}
//               onChange={(e) => setStatusData({ ...statusData, adminRemarks: e.target.value })}
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Resolution"
//               type="text"
//               fullWidth
//               value={statusData.resolution}
//               onChange={(e) => setStatusData({ ...statusData, resolution: e.target.value })}
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleUpdateStatus} color="error" variant="contained">
//             Update Status
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create Dispute Dialog */}
//       <Dialog
//         open={openCreateDialog}
//         onClose={() => setOpenCreateDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Create New Dispute</DialogTitle>
//         <DialogContent>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Complainant ID"
//               type="number"
//               fullWidth
//               value={createDisputeData.complainantId}
//               onChange={(e) =>
//                 setCreateDisputeData({ ...createDisputeData, complainantId: e.target.value })
//               }
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Respondent ID"
//               type="number"
//               fullWidth
//               value={createDisputeData.respondentId}
//               onChange={(e) =>
//                 setCreateDisputeData({ ...createDisputeData, respondentId: e.target.value })
//               }
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Ride ID"
//               type="number"
//               fullWidth
//               value={createDisputeData.rideId}
//               onChange={(e) =>
//                 setCreateDisputeData({ ...createDisputeData, rideId: e.target.value })
//               }
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Description"
//               type="text"
//               fullWidth
//               value={createDisputeData.description}
//               onChange={(e) =>
//                 setCreateDisputeData({ ...createDisputeData, description: e.target.value })
//               }
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//           <MDBox mt={2} mb={3}>
//             <TextField
//               label="Evidence URLs (comma-separated)"
//               type="text"
//               fullWidth
//               value={createDisputeData.evidenceUrls.join(",")}
//               onChange={(e) =>
//                 setCreateDisputeData({
//                   ...createDisputeData,
//                   evidenceUrls: e.target.value.split(","),
//                 })
//               }
//               sx={{
//                 width: { xs: "100%", sm: 300 },
//               }}
//             />
//           </MDBox>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
//           <Button onClick={handleCreateDispute} color="error" variant="contained">
//             Create Dispute
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <Footer />
//     </DashboardLayout>
//   );
// }

// Disputemanagement.propTypes = {
//   row: PropTypes.shape({
//     original: PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       rideId: PropTypes.string.isRequired,
//       complainantId: PropTypes.number,
//       complainantType: PropTypes.string,
//       respondentId: PropTypes.number,
//       respondentType: PropTypes.string,
//       disputeType: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//       evidenceUrls: PropTypes.arrayOf(PropTypes.string),
//       status: PropTypes.string.isRequired,
//       adminRemarks: PropTypes.string,
//       resolution: PropTypes.string,
//       resolvedAt: PropTypes.string,
//       createdAt: PropTypes.string.isRequired,
//       updatedAt: PropTypes.string.isRequired,
//       Ride: PropTypes.shape({
//         id: PropTypes.number,
//         rideId: PropTypes.string,
//         createdRideId: PropTypes.string,
//         hostId: PropTypes.number,
//         userId: PropTypes.number,
//         pickupAddress: PropTypes.string,
//         dropAddress: PropTypes.string,
//         date: PropTypes.string,
//         time: PropTypes.string,
//         numberOfPeople: PropTypes.number,
//         hasPets: PropTypes.bool,
//         numberOfPets: PropTypes.number,
//         specialRequests: PropTypes.string,
//         userLatitude: PropTypes.string,
//         userLongitude: PropTypes.string,
//         duration: PropTypes.number,
//         totalAmount: PropTypes.string,
//         paymentType: PropTypes.string,
//         paymentStatus: PropTypes.string,
//         rideStatus: PropTypes.string,
//         cancellationReason: PropTypes.string,
//         rating: PropTypes.number,
//         review: PropTypes.string,
//         createdAt: PropTypes.string,
//         updatedAt: PropTypes.string,
//         User: PropTypes.shape({
//           id: PropTypes.number,
//           name: PropTypes.string,
//           email: PropTypes.string,
//           phoneNumber: PropTypes.string,
//         }),
//         Host: PropTypes.shape({
//           id: PropTypes.number,
//           name: PropTypes.string,
//           email: PropTypes.string,
//           mobileNumber: PropTypes.string,
//         }),
//       }),
//       complainant: PropTypes.shape({
//         id: PropTypes.number,
//         name: PropTypes.string,
//         email: PropTypes.string,
//         phoneNumber: PropTypes.string,
//       }),
//       respondent: PropTypes.shape({
//         id: PropTypes.number,
//         name: PropTypes.string,
//         email: PropTypes.string,
//         mobileNumber: PropTypes.string,
//       }),
//     }).isRequired,
//   }).isRequired,
// };

// export default Disputemanagement;
