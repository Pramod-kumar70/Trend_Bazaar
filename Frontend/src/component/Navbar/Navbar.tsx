import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import { Typography, Menu, MenuItem, IconButton, Avatar, Tooltip, Modal, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import { GrCart } from "react-icons/gr";
import { AiOutlineShop } from "react-icons/ai";
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
  maxWidth: '550px',
  width: '100%',
  height: '36px',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#d9e6ff'
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: '0.9rem',
  padding: '0 10px',
  color: 'black',
  '& .MuiInputBase-input': {
    padding: 0,
    height: '36px',
    lineHeight: '36px'
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function Navbar({
  Bgcolor = "white",
  TextColor = "black",
  ImageSrc = logoimg,
  imageWidth = "80px"
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [SearchTerm, setSearchTerm] = React.useState("");

  // User menu anchor for logged-in user menu
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Modal open state for Login form
  const [openLoginModal, setOpenLoginModal] = React.useState(false);

  // Login form state
  const [User, setUser] = React.useState({
    Email: "",
    Pass: "",
  });
  const [errors, setErrors] = React.useState({});

  const handleSearch = () => {
    if (!SearchTerm.trim()) {
      toast.warning("Please enter a search term 🔍");
      return;
    }
    navigate(`/search/${SearchTerm}`);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully ✅");
    navigate("/");
    handleCloseUserMenu();
  };

  // Login modal handlers
  const handleOpenLoginModal = () => setOpenLoginModal(true);
  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
    setErrors({});
    setUser({ Email: "", Pass: "" });
  };

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

        handleCloseLoginModal();
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
                  handleOpenLoginModal();
                }
              }}
            >
              <GrCart style={{ marginRight: "5px" }} /> Cart
            </Typography>

            {/* User Avatar and Menu */}
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.profileImage || ""} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/account'); }}>
                    <Typography textAlign="center">Account</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Typography
                sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" }}
                onClick={handleOpenLoginModal}
              >
                <VscAccount style={{ marginRight: "5px" }} /> Login
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Modal */}
      <Modal
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
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
              <Typography
                component="button"
                variant="body2"
                sx={{ cursor: "pointer", color: "#2874f0", border: "none", background: "none", p: 0 }}
                onClick={() => toast.info("Forgot password feature coming soon!")}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#fb641b", "&:hover": { bgcolor: "#e55300" }, py: 1.5, fontWeight: "bold", mb: 2 }}
            >
              Login
            </Button>


          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ cursor: "pointer", color: "#2874f0" }}
            onClick={() => {
              handleCloseLoginModal();
              navigate('/signin');  // Registration page route
            }}
          >
            Create an account
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
