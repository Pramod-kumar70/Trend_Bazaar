import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  FavoriteBorder,
  LocationOnOutlined,
  LockOutlined,
  Logout,
  ReceiptLongOutlined,
  SettingsOutlined,
  ShoppingCartOutlined,
  StarBorderOutlined,
  SupportAgentOutlined,
  CameraAlt,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../Navbar/Navbar";
import FlipkartSecImg from "../../assets/chatgptlogoone.png";

// ---- Flipkart Theme Colors ----
const FK_BLUE = "#2874f0";
const FK_BLUE_DARK = "#1f5ed1";
const CARD_BG = "#ffffff";
const BG = "#f1f3f6";

// ---- Types ----
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}
interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
}

export default function Profile() {
  const token = localStorage.getItem("token");
  const api = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // -------- Fetch Profile --------
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${api}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          profileImage: res.data.profileImage || "",
        });
        setImagePreview(res.data.profileImage || "");
      } catch (err: any) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- Cloudinary Upload --------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_preset");
    data.append("cloud_name", "dxqdd6faa");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxqdd6faa/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setImagePreview(uploaded.secure_url);
        setForm((f) => ({ ...f, profileImage: uploaded.secure_url }));
        toast.success("Photo uploaded");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // -------- Save Profile --------
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${api}/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated");
      setEditMode(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // -------- Change Password --------
  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill both password fields");
      return;
    }
    setPwdSaving(true);
    try {
      await axios.put(`${api}/users/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password updated");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setPwdSaving(false);
    }
  };

  const memberSince = useMemo(() => {
    if (!user?._id) return "Member";
    return "Member since 2025";
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          bgcolor: BG,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh", pb: 6 }}>
      <Navbar
        Bgcolor="#a8d5e2"
        TextColor="#0a2647"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />

      <Grid container justifyContent="space-evenly" pt="90px">
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box
              sx={{
                bgcolor: CARD_BG,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={imagePreview || ""}
                  alt={user?.name || "User"}
                  sx={{ width: 72, height: 72, border: "2px solid #eee" }}
                />
                <Tooltip title="Change photo">
                  <IconButton
                    component="label"
                    size="small"
                    sx={{
                      position: "absolute",
                      right: -6,
                      bottom: -6,
                      bgcolor: FK_BLUE,
                      color: "#fff",
                      "&:hover": { bgcolor: FK_BLUE_DARK },
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                    disabled={!editMode || uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      <CameraAlt fontSize="inherit" />
                    )}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {user?.name || "Your Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {memberSince}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <List sx={{ bgcolor: CARD_BG }}>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ReceiptLongOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="My Orders"
                  secondary="View, track, cancel orders"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FavoriteBorder />
                </ListItemIcon>
                <ListItemText
                  primary="Wishlist"
                  secondary="All your saved items"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ShoppingCartOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="My Cart"
                  secondary="Checkout your items"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocationOnOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="Saved Addresses"
                  secondary="Manage delivery addresses"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <StarBorderOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="Reviews & Ratings"
                  secondary="Your product reviews"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SupportAgentOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="Help Center"
                  secondary="24x7 customer support"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Logout color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md={8}>
          {/* Personal Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: CARD_BG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Personal Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your name, email, phone and address
                </Typography>
              </Box>
              {editMode ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || uploading}
                    sx={{
                      bgcolor: FK_BLUE,
                      "&:hover": { bgcolor: FK_BLUE_DARK },
                      fontWeight: 700,
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setForm({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        address: user?.address || "",
                        profileImage: user?.profileImage || "",
                      });
                      setImagePreview(user?.profileImage || "");
                    }}
                    sx={{ fontWeight: 700 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(true)}
                  sx={{
                    borderColor: FK_BLUE,
                    color: FK_BLUE,
                    fontWeight: 700,
                    "&:hover": { borderColor: FK_BLUE_DARK, color: FK_BLUE_DARK },
                  }}
                  startIcon={<SettingsOutlined />}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Address"
                  fullWidth
                  value={form.address || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Password Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 2,
              bgcolor: CARD_BG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LockOutlined sx={{ color: FK_BLUE }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep your account secure by updating your password
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Old Password"
                  fullWidth
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="New Password"
                  fullWidth
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={pwdSaving}
                sx={{
                  bgcolor: FK_BLUE,
                  "&:hover": { bgcolor: FK_BLUE_DARK },
                  fontWeight: 700,
                }}
              >
                {pwdSaving ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          </Paper>

          {/* Perks / Info band */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 3,
              borderRadius: 2,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
              bgcolor: "#e8f0fe",
              border: "1px solid #d6e2ff",
            }}
          >
            <Chip label="Secure Payments" />
            <Chip label="Easy Returns" />
            <Chip label="24x7 Support" />
            <Chip label="Genuine Products" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
