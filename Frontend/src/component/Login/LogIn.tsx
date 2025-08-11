// Log In 
import { toast } from "react-toastify";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from './../Navbar/Navbar';
import FlipkartSecImg from "../../assets/F4.png"



export default function LogIn() {

  const navigate = useNavigate()
  const [User, setUser] = useState({

    Email: "",
    Pass: ""
  });

  const [errors, setErrors] = useState({});

  async function HandleSubmit(e) {
    e.preventDefault();


    const newErrors = {};
    if (!User.Email.trim()) newErrors.Email = "Email is required";
    if (!User.Pass.trim()) newErrors.Pass = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submit
    }

    setErrors({}); // Clear previous errors


    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({

          email: User.Email,
          password: User.Pass
        })
      });

      const data = await response.json();

      if (response.ok) {
       toast.success("Login Successful! 🎉");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log("Response:", data);
        navigate('/')
        setUser({ Email: "", Pass: "" });

      } else {
        toast.error(data.message || "Invalid email or password ❌");
      }

    } catch (error) {
      console.error("Error while sending request:", error);
      toast.error("Something went wrong. Please try again ❌");
    }
  }

  return (
    <>
      <Navbar Bgcolor='#2874f0' TextColor='white' ImageSrc={FlipkartSecImg} imageWidth="40px" />
      <Grid container justifyContent={'center'} mt={"80px"} >
        <Grid size={2} bgcolor={'blue'} color={'white'} p={4} boxShadow={3}>
          <Typography variant="h4" fontWeight={'bold'} >Log In</Typography>
          <Typography my={3}>Get access to your Orders, Wishlist and Recommendations</Typography>
          <img src="https://flickart-aashish.vercel.app/assets/auth-5b5fdc9c.png" width={'100%'} alt="" />

        </Grid>
        <Grid size={3.5} container padding={3} boxShadow={3} justifyContent={'center'} >
          <Grid size={11}>


            <form onSubmit={HandleSubmit}>




              {/* Email */}
              <div style={{ marginBlock: '30px' }}>
                <label htmlFor="email">Email</label> <br />
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
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label htmlFor="password" >Password</label>
                  <label style={{ textAlign: "end", color: "blue" }} >forget password?</label>



                </div>
                <input
                  type="password"
                  className="InputField"
                  value={User.Pass}
                  onChange={(e) => setUser({ ...User, Pass: e.target.value })}
                /> <br />
                {errors.Pass && <span style={{ color: 'red', fontSize: '13px' }}>{errors.Pass}</span>}
              </div>

              <div style={{ textAlign: 'center' }}>
                <input type="submit" value="Log in" style={{ marginBlock: 10, padding: "10px", backgroundColor: "orangered", color: "white", border: "none", borderRadius: 5 }} />
                <Typography>Create an account ? <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>  <NavLink to='/signin'>signup</NavLink></span></Typography>
              </div>
            </form>
          </Grid>
        </Grid>

      </Grid>
    </>
  );
}
