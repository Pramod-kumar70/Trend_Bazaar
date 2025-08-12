import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Link as MuiLink,
  Modal,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import FlipkartSecImg from "../../assets/F4.png";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90vw",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function LogInModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [User, setUser] = useState({
    Email: "",
    Pass: "",
  });

  const [errors, setErrors] = useState({});

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
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: User.Email,
          password: User.Pass,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login Successful! 🎉");

        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("user");
        }

        setUser({ Email: "", Pass: "" });
        handleClose();
        navigate("/");
      } else {
        toast.error(data.message || "Invalid email or password ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again ❌");
    }
  }

  return (
    <>
      <Navbar
        Bgcolor="#2874f0"
        TextColor="white"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Button variant="contained" onClick={handleOpen} sx={{ py: 1.5, px: 4 }}>
          Open Login
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="login-modal-title">
        <Box sx={modalStyle}>
          <Typography
            id="login-modal-title"
            variant="h5"
            component="h2"
            mb={2}
            fontWeight="bold"
            textAlign="center"
          >
            Login to your account
          </Typography>

          <form onSubmit={HandleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
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
              variant="outlined"
              margin="normal"
              value={User.Pass}
              onChange={(e) => setUser({ ...User, Pass: e.target.value })}
              error={Boolean(errors.Pass)}
              helperText={errors.Pass}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <MuiLink
                component="button"
                variant="body2"
                sx={{ cursor: "pointer", color: "#2874f0" }}
                onClick={() => toast.info("Forgot password feature coming soon!")}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#fb641b", "&:hover": { bgcolor: "#e55300" }, py: 1.5, fontWeight: "bold", mb: 2 }}
            >
              Login
            </Button>

            <Typography textAlign="center" variant="body2">
              New to Flipkart?{" "}
              <NavLink
                to="/signin"
                style={{ color: "#2874f0", textDecoration: "none", fontWeight: "bold" }}
                onClick={handleClose} // close modal when going to sign up
              >
                Create an account
              </NavLink>
            </Typography>
          </form>
        </Box>
      </Modal>
    </>
  );
}
