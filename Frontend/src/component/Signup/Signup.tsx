import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";

export default function Signup({ open, handleClose, onLoginClick }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3001/users/register", form);
      toast.success("Account Created Successfully");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ minHeight: "70vh" }}>
          {/* Left Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              backgroundColor: "#2874f0",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 4,
              py: 6,
              backgroundImage:
                "url('https://rukminim1.flixcart.com/www/800/800/promos/26/07/2019/ef7b0406-64aa-4e3c-b08e-15b6e8b6e1e1.png?q=90')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center bottom",
              backgroundSize: "240px",
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Looks like you're new here!
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", opacity: 0.9 }}>
              Sign up with your details to get started
            </Typography>
          </Grid>

          {/* Right Section */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              backgroundColor: "#f1f3f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                width: "100%",
                maxWidth: 400,
                borderRadius: 1.5,
                backgroundColor: "white",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              }}
            >
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
              />
              <TextField
                fullWidth
                label="Mobile Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                margin="normal"
                variant="standard"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                variant="standard"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                margin="normal"
                variant="standard"
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#fb641b",
                  "&:hover": { backgroundColor: "#e75a13" },
                  py: 1.5,
                  fontWeight: "bold",
                  mt: 2,
                  mb: 2,
                  textTransform: "none",
                  borderRadius: 1,
                }}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Creating..." : "Sign Up"}
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* Fixed Login Link */}
              <Typography textAlign="center" variant="body2">
                Existing User?{" "}
                <span
                  style={{ color: "#2874f0", fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => {
                    handleClose(); // Close signup popup
                    onLoginClick(); // Open login popup
                  }}
                >
                  Log in
                </span>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
