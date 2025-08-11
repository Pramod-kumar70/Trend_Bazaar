import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import { Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import { GrCart } from "react-icons/gr";
import { AiOutlineShop } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoimg from '../../assets/images.png';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f0f5ff',
  borderRadius: '2px',
  marginLeft: 20,
  maxWidth: '550px',   // Flipkart size
  width: '100%',
  height: '36px',      // Exact Flipkart height
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#d9e6ff'
  }
  // Icon aur input overlap na ho
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: '0.9rem',
  padding: '0 10px',
  color: 'black',
  '& .MuiInputBase-input': {
    padding: 0,
    height: '36px',    // Input height match
    lineHeight: '36px' // Text vertical center
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  backgroundColor: '#ffe11b',
  height: '100%',
  width: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderTopRightRadius: '2px',
  borderBottomRightRadius: '2px',
}));




export default function Navbar({
  Bgcolor = "white",
  TextColor = "black",
  ImageSrc = logoimg,
  imageWidth = "80px"
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [SearchTerm, setSearchTerm] = React.useState("");

  const handleSearch = () => {
    if (!SearchTerm.trim()) {
      toast.warning("Please enter a search term 🔍");
      return;
    }
    navigate(`/search/${SearchTerm}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute" sx={{ bgcolor: Bgcolor, color: TextColor, boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* Logo */}
          <Link to='/'>
            <Box
              component='img'
              src={ImageSrc}
              alt="Logo"
              sx={{ width: imageWidth, cursor: "pointer", borderRadius: 1.5 }}
            />
          </Link>

          {/* Search Bar */}
          <Search>
            <StyledInputBase
              placeholder="Search for products, brands and more"
              value={SearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchIconWrapper onClick={handleSearch}>
              <SearchIcon style={{ color: "#2874f0" }} />
            </SearchIconWrapper>
          </Search>

          {/* Right Side Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>

            {/* Become a Seller */}
            <Typography
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => {
                const baseUrl = window.location.origin;
                if (window.location.pathname === "/BecomeaSeller") return;
                window.open(`${baseUrl}/BecomeaSeller`, "_blank", "noopener,noreferrer");
              }}
            >
              <AiOutlineShop style={{ marginRight: "5px" }} /> Become a Seller
            </Typography>

            {/* Cart */}
            <Typography
              sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
              onClick={() => {
                if (token) navigate('/cart/Details/MyCart');
                else {
                  toast.info("Please login to view your cart 🛍️");
                  navigate('/login');
                }
              }}
            >
              <GrCart style={{ marginRight: "5px" }} /> Cart
            </Typography>

            {/* Login / Logout */}
            {token ? (
              <Typography
                sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  toast.success("Logged out successfully ✅");
                  navigate("/login");
                }}
              >
                <MdOutlineLogout style={{ marginRight: "5px" }} /> Logout
              </Typography>
            ) : (
              <Typography
                sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
                onClick={() => navigate('/login')}
              >
                <VscAccount style={{ marginRight: "5px" }} /> Login
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
