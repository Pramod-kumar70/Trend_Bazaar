import { useState } from "react";
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
import "./SignIn.css";

// 👇 Firebase import
import { auth, googleProvider } from "../../Firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleLogo from "../../assets/Google.png";

interface SignupProps {
  open: boolean;
  handleClose: () => void;
  onLoginClick: () => void;
}

export default function Signup({
  open = false,
  handleClose = () => {},
  onLoginClick = () => {},
}: SignupProps) {
  const api = import.meta.env.VITE_API_BASE_URL as string;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${api}/users/register`, form);
      toast.success("Account Created Successfully");
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  // 👇 Google Signup
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios.post(`${api}/users/google-register`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        googleId: user.uid,
      });

      toast.success(`Welcome ${user.displayName}`);
      handleClose();
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google signup failed");
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
            xs={5}
            className="BgImg"
            sx={{
              color: "white",
              display: "flex",
              flexDirection: "column",
              px: 4,
              py: 3,
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
            xs={7}
            sx={{
              backgroundColor: "#f1f3f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 5,
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

              {/* 👇 Google Signup Button */}
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  mb: 2,
                  textTransform: "none",
                  borderRadius: 1,
                }}
                onClick={handleGoogleSignup}
              >
                <Box component="img" src={GoogleLogo} width={"20px"} mx={2} />{" "}
                Sign up with Google
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* Fixed Login Link */}
              <Typography textAlign="center" variant="body2">
                Existing User?{" "}
                <span
                  style={{
                    color: "#2874f0",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleClose();
                    onLoginClick();
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
