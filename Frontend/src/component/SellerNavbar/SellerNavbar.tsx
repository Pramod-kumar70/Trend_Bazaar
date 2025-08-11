import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardLogoImg from "../../assets/F4.png"


export default function SellerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2874f0", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left: Logo and Brand */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/BecomeaSeller/SellerDashboard")}>
         <Box component='img' src={DashboardLogoImg} sx={{width:"30px" ,mx:2, borderRadius:2}}  />
          <Typography variant="h6" fontWeight="bold">Seller Hub</Typography>
        </Box>

        {/* Right: Nav Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/BecomeaSeller/SellerDashboard")}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate("/BecomeaSeller/Products")}>Products</Button>
          <Button color="inherit" onClick={() => navigate("/BecomeaSeller/Orders")}>Orders</Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
