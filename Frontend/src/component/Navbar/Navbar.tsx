import { useState } from "react";
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
  useMediaQuery,
  Grid,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import { VscAccount } from "react-icons/vsc";
import { GrCart } from "react-icons/gr";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Login from "../Login/LogIn";
import Signup from "../Signup/Signup";
import logoimg from "../../assets/chatgptcrp.png";

const Search = styled("div")(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f0f5ff",
  borderRadius: "2px",
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

export default function Navbar({
  Bgcolor = "#ffdac6",
  TextColor = "Black",
  ImageSrc = logoimg,
  imageWidth = "110px",
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
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
    <Box  mb={9}>
      <AppBar position="absolute" sx={{ bgcolor: Bgcolor, color: TextColor, boxShadow: 3 ,py:{lg:0 ,md:1,sm:.5 ,xs:.5}} }>
        <Toolbar sx={{ display: "flex", flexDirection:{md:"row" ,sm:"column" , xs:"column"}, }}>
          {/* Top Row (Logo + Searchbar) */}
          <Grid container alignItems="center" justifyContent={'space-between'} px={1}>
            <Grid item xs={1} md={3}>
              <Box
                component="img"
                src={ImageSrc}
                alt="Logo"
                sx={{ width:{md:imageWidth , sm:"100px" , xs:"80px"}, cursor: "pointer", borderRadius: 1.5 }}
                onClick={() => navigate("/")}
              />
            </Grid>
            <Grid item xs={8} md={8}>
              <Search>
                <StyledInputBase
                  placeholder="Search for products, brands and more"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <SearchIconWrapper onClick={handleSearch}>
                  <SearchIcon style={{ color: "#0a2647" }} />
                </SearchIconWrapper>
              </Search>
            </Grid>
          </Grid>

          {/* Bottom Row (Only show on md and below OR inline on lg) */}
          <Box
            sx={{
              display: "flex",
              gap:{md:4 ,sm:2 ,xs:1},
              mt: isSmallScreen ? 1 : 0,
              justifyContent: isSmallScreen ? "space-between" : "flex-end",
              width: "100%",
              
            }}
          >
            <Typography
              sx={{ cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" }, fontSize:{md:"16px" ,sm:"13px" ,xs:"13px"} }}
              onClick={() => window.open("/BecomeaSeller", "_blank")}
            >
              <AiOutlineShop style={{ marginTop: -3 }} /> Become a Seller
            </Typography>

            <Typography
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" }, fontSize:{md:"16px" ,sm:"13px" ,xs:"13px"} 
              }}
              onClick={(e) => setMoreAnchor(moreAnchor ? null : e.currentTarget)}
            >
              More {moreAnchor ? "▲" : "▼"}
            </Typography>
            <Menu
              anchorEl={moreAnchor}
              open={Boolean(moreAnchor)}
              onClose={() => setMoreAnchor(null)}
            >
              <MenuItem>🔔 Notification Preferences</MenuItem>
              <MenuItem>📞 24x7 Customer Care</MenuItem>
              <MenuItem>📢 Advertise</MenuItem>
              <MenuItem>⬇️ Download App</MenuItem>
            </Menu>

            <Typography
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                "&:hover": { textDecoration: "underline" }, fontSize:{md:"16px" ,sm:"13px" ,xs:"13px"} 
              }}
              onClick={() => {
                if (token) navigate("/cart/Details/MyCart");
                else setOpenLogin(true);
              }}
            >
              <GrCart style={{ marginRight: "2px", }} /> Cart
            </Typography>

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
              <Typography
                sx={{ cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center" , fontSize:{md:"16px" ,sm:"13px" ,xs:"13px" }}}
                onClick={() => setOpenLogin(true)}
              >
                <VscAccount style={{ marginRight: "5px" }} /> Login
              </Typography>
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
