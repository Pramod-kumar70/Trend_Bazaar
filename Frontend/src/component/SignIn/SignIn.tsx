import { Grid, Typography } from "@mui/material";
import './SignIn.css';
import { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './../Navbar/Navbar';

export default function SignIn() {

  const [User, setUser] = useState({
    fullName: "",
    Email: "",
    Pass: "",
    ProfileImage: "" // ✅ Image URL store karne ke liye
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // ✅ Cloudinary pe image upload function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_preset"); // 🔹 tumhara preset name
    data.append("cloud_name", "dxqdd6faa");    // 🔹 tumhara cloud name

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

  async function HandleSubmit(e) {
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
          profileImage: User.ProfileImage // ✅ DB me image ka URL bhejna
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("User signed up successfully!");
        console.log("Response:", data);
        setUser({ fullName: "", Email: "", Pass: "", ProfileImage: "" });
        navigate('/');
      } else {
        alert("Error: " + data.message);
      }

    } catch (error) {
      console.error("Error while sending request:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <Grid container justifyContent={'center'} mt={'80px'}>
        <Grid size={2} bgcolor={'blue'} color={'white'} p={4} boxShadow={3}>
          <Typography variant="h4" fontWeight={'bold'}>Sign In</Typography>
          <Typography my={3}>Get access to your Orders, Wishlist and Recommendations</Typography>
          <img src="https://flickart-aashish.vercel.app/assets/auth-5b5fdc9c.png" width={'100%'} alt="" />
        </Grid>

        <Grid size={3.5} container padding={3} boxShadow={3} justifyContent={'center'}>
          <Grid size={11}>
            <form onSubmit={HandleSubmit}>

              {/* Full Name */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Full name</label> <br />
                <input
                  type="text"
                  className="InputField"
                  value={User.fullName}
                  onChange={(e) => setUser({ ...User, fullName: e.target.value })}
                /> <br />
                {errors.fullName && <span style={{ color: 'red', fontSize: '13px' }}>{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div style={{ marginBlock: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>Email</label> <br />
                <input
                  type="email"
                  className="InputField"
                  value={User.Email}
                  onChange={(e) => setUser({ ...User, Email: e.target.value })}
                /> <br />
                {errors.Email && <span style={{ color: 'red', fontSize: '13px' }}>{errors.Email}</span>}
              </div>

              {/* Password */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Password</label> <br />
                <input
                  type="password"
                  className="InputField"
                  value={User.Pass}
                  onChange={(e) => setUser({ ...User, Pass: e.target.value })}
                /> <br />
                {errors.Pass && <span style={{ color: 'red', fontSize: '13px' }}>{errors.Pass}</span>}
              </div>

              {/* Profile Image Upload */}
              <div style={{ marginBlock: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>Profile Image</label> <br />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <p>Uploading image...</p>}
                {User.ProfileImage && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={User.ProfileImage} alt="Preview" width="100" />
                  </div>
                )}
                {errors.ProfileImage && <span style={{ color: 'red', fontSize: '13px' }}>{errors.ProfileImage}</span>}
              </div>

              <div style={{ textAlign: 'center' }}>
                <input
                  type="submit"
                  value={uploading ? "Uploading..." : "Sign In"}
                  disabled={uploading}
                  style={{ marginBlock: 10, padding: "10px", backgroundColor: "orangered", color: "white", border: "none", borderRadius: 5 }}
                />
                <Typography>
                  Already have an account? <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>
                    <NavLink to='/login'>Log in</NavLink>
                  </span>
                </Typography>
              </div>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
