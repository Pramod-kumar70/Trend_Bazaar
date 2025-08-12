// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Box, Avatar, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.info("Please login first");
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:3001/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
      setImagePreview(res.data.profileImage || "");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone || "");
      formData.append("address", form.address || "");
      // email included optionally:
      formData.append("email", form.email || "");
      if (imageFile) {
        formData.append("profileImage", imageFile); // multer will handle
      }

      const res = await axios.put("http://localhost:3001/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      // update localStorage - keep key consistent with your app
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("userDetails", JSON.stringify(res.data)); // whichever you use
      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <Box p={4} textAlign="center">
          <Typography variant="h6">No user data. Please login.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom>My Profile hi</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              src={imagePreview || "https://via.placeholder.com/150"}
              alt={user.name}
              sx={{ width: 140, height: 140, mx: "auto" }}
            />
            {editMode && (
              <Box mt={2}>
                <Button component="label" variant="outlined">
                  Change Photo
                  <input type="file" hidden accept="image/*" onChange={handleImageSelect} />
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              disabled={!editMode}
              sx={{ mb: 2 }}
            />

            {editMode ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" onClick={handleSave}>Save</Button>
                <Button variant="outlined" onClick={() => { setEditMode(false); setForm({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  address: user.address || ""
                }); setImageFile(null); setImagePreview(user.profileImage || ""); }}>Cancel</Button>
              </Box>
            ) : (
              <Button variant="contained" onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
