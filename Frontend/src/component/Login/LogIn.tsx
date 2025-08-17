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
import { Link as MuiLink } from "@mui/material";
export default function Login({ open, handleClose, onSignupClick ,onLoginSuccess }) {
  const [User, setUser] = useState({ Email: "", Pass: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function HandleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!User.Email.trim()) newErrors.Email = "Email is required";
    if (!User.Pass.trim()) newErrors.Pass = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: User.Email, password: User.Pass }),
      });
      const data = await response.json();
     if (response.ok) {
  toast.success("Login Successful! 🎉");
  localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  else localStorage.removeItem("user");
  setUser({ Email: "", Pass: "" });
  handleClose();

  // ✅ Agar onLoginSuccess prop diya gaya hai to call karo
  if (typeof onLoginSuccess === "function") {
    onLoginSuccess();
  }
} else {
        toast.error(data.message || "Invalid email or password ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again ❌");
    } finally {
      setLoading(false);
    }
  }

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
              Login to your account
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", opacity: 0.9 }}>
              Get access to your orders, wishlist, and recommendations
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
              <form onSubmit={HandleSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="standard"
                  margin="normal"
                  value={User.Email}
                  onChange={(e) => setUser({ ...User, Email: e.target.value })}
                  error={Boolean(errors.Email)}
                  helperText={errors.Email}
                  autoFocus
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="standard"
                  margin="normal"
                  value={User.Pass}
                  onChange={(e) => setUser({ ...User, Pass: e.target.value })}
                  error={Boolean(errors.Pass)}
                  helperText={errors.Pass}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#fb641b",
                    "&:hover": { bgcolor: "#e55300" },
                    py: 1.5,
                    fontWeight: "bold",
                    mt: 2,
                    mb: 2,
                    textTransform: "none",
                    borderRadius: 1,
                  }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography textAlign="center" variant="body2">
                  New to Flipkart?{" "}
                  <MuiLink
                    component="button"
                    sx={{ color: "#2874f0", fontWeight: "bold", textDecoration: "none" }}
                    onClick={onSignupClick}
                  >
                    Create an account
                  </MuiLink>
                </Typography>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
