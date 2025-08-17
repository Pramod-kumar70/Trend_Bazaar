import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import { VscAccount } from "react-icons/vsc";
import { GrCart } from "react-icons/gr";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import logoimg from "../../assets/images.png";

const Search = styled("div")(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f0f5ff",
  borderRadius: "2px",
  marginLeft: 20,
  maxWidth: "550px",
  width: "100%",
  height: "36px",
  overflow: "hidden",
  "&:hover": { backgroundColor: "#d9e6ff" },
}));

const StyledInputBase = styled(InputBase)(() => ({
  flex: 1,
  fontSize: "0.9rem",
  padding: "0 10px",
  color: "black",
  "& .MuiInputBase-input": { padding: 0, height: "36px", lineHeight: "36px" },
}));

const SearchIconWrapper = styled("div")(() => ({
  backgroundColor: "#ffe11b",
  height: "100%",
  width: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderTopRightRadius: "2px",
  borderBottomRightRadius: "2px",
}));

export default function Navbar({Bgcolor="White" ,TextColor="Black" ,ImageSrc = logoimg ,  imageWidth = "90px"}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.warning("Please enter a search term 🔍");
      return;
    }
    navigate(`/search/${searchTerm}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully ✅");
    setUser(null);
    setProfileMenuAnchor(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute" sx={{ bgcolor: Bgcolor, color: TextColor, boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Logo */}
          <Box
            component="img"
            src={ ImageSrc}
            alt="Logo"
            sx={{ width: imageWidth, cursor: "pointer", borderRadius: 1.5 }}
            onClick={() => navigate("/")}
          />

          {/* Search Bar */}
          <Search>
            <StyledInputBase
              placeholder="Search for products, brands and more"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon style={{ color: "#2874f0" }} />
            </SearchIconWrapper>
          </Search>

          <Box sx={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <Typography
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => window.open("/BecomeaSeller", "_blank")}
            >
              <AiOutlineShop style={{ marginRight: "5px" }} /> Become a Seller
            </Typography>

            <Typography
              sx={{ cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
            >
              More ▼
            </Typography>

            <Typography
              sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
              onClick={() => {
                if (token) navigate("/cart/Details/MyCart");
                else setOpenLogin(true);
              }}
            >
              <GrCart style={{ marginRight: "5px" }} /> Cart
            </Typography>

            {/* User Section */}
            {user ? (
              <>
                <IconButton onClick={(e) => setProfileMenuAnchor(e.currentTarget)}>
                  <Avatar alt={user.name} src={user.profileImage || ""} />
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={() => setProfileMenuAnchor(null)}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenuAnchor(null);
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Typography
                  sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
                  onClick={() => setOpenLogin(true)}
                >
                  <VscAccount style={{ marginRight: "5px" }} /> Login
                </Typography>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Popup */}
      {openLogin && (
        <Login
         onLoginSuccess={() => window.location.reload()}
          open={openLogin}
          handleClose={() => setOpenLogin(false)}
          onSignupClick={() => {
            setOpenLogin(false);
            setOpenSignup(true);
          }}
        />
      )}

      {/* Signup Popup */}
      {openSignup && (
        <Signup
          open={openSignup}
          handleClose={() => setOpenSignup(false)}
          onLoginClick={() => {
            setOpenSignup(false);
            setOpenLogin(true);
          }}
        />
      )}
    </Box>
  );
}
