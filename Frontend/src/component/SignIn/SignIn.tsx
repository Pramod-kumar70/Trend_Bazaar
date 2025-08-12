import { Grid, Typography, TextField, Button, Box, Paper, Stack, FormHelperText } from "@mui/material";
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Navbar from './../Navbar/Navbar';
import { toast } from "react-toastify";

export default function SignIn() {
  const [User, setUser] = useState({
    fullName: "",
    Email: "",
    Pass: "",
    ProfileImage: ""
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Cloudinary image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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
          body: data
        }
      );
      const uploadedImage = await res.json();
      setUser({ ...User, ProfileImage: uploadedImage.secure_url });
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!User.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!User.Email.trim()) newErrors.Email = "Email is required";
    if (!User.Pass.trim()) newErrors.Pass = "Password is required";
    if (!User.ProfileImage.trim()) newErrors.ProfileImage = "Profile Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: User.fullName,
          email: User.Email,
          password: User.Pass,
          profileImage: User.ProfileImage
        })
      });

      const data = await response.json();

      if (response.ok) {
       toast.success("User signed up successfully!");
        setUser({ fullName: "", Email: "", Pass: "", ProfileImage: "" });
        navigate('/');
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error while sending request:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Grid container justifyContent="center" sx={{ mt: 10, px: 2 }}>
        {/* Left Info Panel */}
        <Grid size={3} sx={{ bgcolor: '#1976d2', color: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Sign Up</Typography>
          <Typography mb={3} fontSize="1.1rem">
            Create your account to access your Orders, Wishlist, and personalized Recommendations.
          </Typography>
          <Box
            component="img"
            src="https://flickart-aashish.vercel.app/assets/auth-5b5fdc9c.png"
            alt="Sign up illustration"
            sx={{ width: '100%', borderRadius: 2, boxShadow: 4 }}
          />
        </Grid>

        {/* Form Panel */}
        <Grid size={5} sx={{ mt: { xs: 4, md: 0 }, p: 4 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <form onSubmit={HandleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={User.fullName}
                  onChange={(e) => setUser({ ...User, fullName: e.target.value })}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName}
                  required
                />

                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={User.Email}
                  onChange={(e) => setUser({ ...User, Email: e.target.value })}
                  error={Boolean(errors.Email)}
                  helperText={errors.Email}
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={User.Pass}
                  onChange={(e) => setUser({ ...User, Pass: e.target.value })}
                  error={Boolean(errors.Pass)}
                  helperText={errors.Pass}
                  required
                />

                <Box>
                  <Typography mb={1} fontWeight="bold">Profile Image</Typography>
                  <Button variant="contained" component="label" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {errors.ProfileImage && (
                    <FormHelperText error>{errors.ProfileImage}</FormHelperText>
                  )}
                  {User.ProfileImage && (
                    <Box mt={2}>
                      <img
                        src={User.ProfileImage}
                        alt="Profile preview"
                        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                      />
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: "orangered", fontWeight: "bold", py: 1.5, "&:hover": { bgcolor: "#e55300" } }}
                  disabled={uploading}
                >
                  {uploading ? "Please wait..." : "Sign Up"}
                </Button>

                
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
