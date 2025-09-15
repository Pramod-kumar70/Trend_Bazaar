import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Slider from "./../Slider/Slider";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";
import rupee from "../../assets/image copy 2.png"
import UPI from "../../assets/image copy 3.png"


function Home() {
  const [ProductList, setProductList] = useState({});
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  async function getAllData() {
    try {
      const response = await fetch(`${api}/product`);
      const data = await response.json();
      setProductList(data);
    } catch (err) {
      console.log("Error while fetching all data from home page", err);
      toast.error("Failed to load products!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  if (Loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <CircularProgress />
      </Box>
    );
  }



  // Container style (Flipkart white section)
  const containerStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    margin: "20px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  };

  // Image style
  const imageStyle = {
    objectFit: "contain",
    width: "100%",
    height: "140px",
    borderRadius: "10px",
    marginBottom: "10px",
    transition: "transform 0.3s ease",
  };

  // Flipkart-style card hover
  const gridItemStyle = {
    cursor: "pointer",
    padding: "10px",
    borderRadius: "4px",
    border: "2px solid transparent",
    backgroundColor: "white",
    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0px 2px 6px rgba(75, 78, 78, 0.4)",
      backgroundColor: "#f1f6ff77",
    },
  };

  // View All Button style
  const viewAllButtonStyle = {
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "#2874f0",
    "&:hover": {
      bgcolor: "#1565c0",
      boxShadow: "0px 6px 15px rgba(21,101,192,0.4)",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease",
    borderRadius: "5px",
    paddingX: 2,
  };

  // Section header with View All
  const SectionHeader = ({ title, onViewAll }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        px: 1,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Button variant="contained" sx={viewAllButtonStyle} onClick={onViewAll}>
        View All
      </Button>
    </Box>
  );

  const handleCardClick = (id) => {
    navigate(`/${id}`);
  };

  // 🔹 Reusable Section
  const renderSection = (title, dataKey, route, fallbackOffer = 5) => {
    const items = ProductList?.[dataKey] || [];
    if (!items.length) return null;

    return (
      <Box sx={containerStyle}>
        <SectionHeader title={title} onViewAll={() => navigate(`/search/${route}`)} />
        <Grid container justifyContent={"space-evenly"}>
          {items.map((item) => (
            <Grid
              size={1.5}
              key={item._id}
              textAlign={"center"}
              sx={gridItemStyle}
              onClick={() => handleCardClick(item._id)}
            >
              <Box component="img" src={item.thumbnail} alt={item.title} sx={imageStyle} />
              <Typography fontSize={14} noWrap>
                {item.title}
              </Typography>
              <Typography fontSize={17} fontWeight={600}>
                Upto {item.Offer || fallbackOffer}% off
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Footer Component
  const Footer = () => (
    <Box sx={{ bgcolor: "#172337", color: "#fff", mt: 5, px: 0, pt: 4, pb: 0 }}>
      <Grid container spacing={0} sx={{ maxWidth: "1200px", margin: "auto" }}>
        <Grid item xs={12} sm={2.5} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>ABOUT</Typography>
          <Typography variant="body2">Contact Us</Typography>
          <Typography variant="body2">About Us</Typography>
          <Typography variant="body2">Careers</Typography>
          <Typography variant="body2">Flipkart Stories</Typography>
          <Typography variant="body2">Press</Typography>
          <Typography variant="body2">Flipkart Wholesale</Typography>
          <Typography variant="body2">Corporate Information</Typography>
        </Grid>
        <Grid item xs={12} sm={2.5} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>HELP</Typography>
          <Typography variant="body2">Payments</Typography>
          <Typography variant="body2">Shipping</Typography>
          <Typography variant="body2">Cancellation & Returns</Typography>
          <Typography variant="body2">FAQ</Typography>
          <Typography variant="body2">Report Infringement</Typography>
        </Grid>
        <Grid item xs={12} sm={2.5} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>CONSUMER POLICY</Typography>
          <Typography variant="body2">Return Policy</Typography>
          <Typography variant="body2">Terms Of Use</Typography>
          <Typography variant="body2">Security</Typography>
          <Typography variant="body2">Privacy</Typography>
          <Typography variant="body2">Sitemap</Typography>
          <Typography variant="body2">Grievance Redressal</Typography>
          <Typography variant="body2">EPR Compliance</Typography>
        </Grid>
        <Grid item xs={12} sm={2.5} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>Mail Us:</Typography>
          <Typography variant="body2">Flipkart Internet Private Limited,</Typography>
          <Typography variant="body2">Buildings Alyssa, Begonia &</Typography>
          <Typography variant="body2">Clove Embassy Tech Village,</Typography>
          <Typography variant="body2">Outer Ring Road, Devarabeesanahalli Village,</Typography>
          <Typography variant="body2">Bengaluru, 560103,</Typography>
          <Typography variant="body2">Karnataka, India</Typography>
        </Grid>
        <Grid item xs={12} sm={2.5} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>Registered Office Address:</Typography>
          <Typography variant="body2">Flipkart Internet Private Limited,</Typography>
          <Typography variant="body2">Buildings Alyssa, Begonia &</Typography>
          <Typography variant="body2">Clove Embassy Tech Village,</Typography>
          <Typography variant="body2">Outer Ring Road, Devarabeesanahalli Village,</Typography>
          <Typography variant="body2">Bengaluru, 560103,</Typography>
          <Typography variant="body2">Karnataka, India</Typography>
          <Typography variant="body2">CIN : U51109KA2012PTC066107</Typography>
          <Typography variant="body2">Telephone: 044-45614700</Typography>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>Social</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Link color="inherit" display="block"><img src="https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo" width={"30px"} alt="Facebook" style={{ borderRadius: 5 }} /></Link>
            <Link color="inherit" display="block"><img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" width={"30px"} alt="YouTube" /></Link>
            <Link color="inherit" display="block"><img src="https://store-images.s-microsoft.com/image/apps.26737.9007199266244427.c75d2ced-a383-40dc-babd-1ad2ceb13c86.ed1d047e-03d9-4cd8-a342-c4ade1e58951" width={"30px"} alt="Twitter" style={{ borderRadius: 5 }} /></Link>
            <Link color="inherit" display="block"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width={"30px"} alt="Instagram" style={{ borderRadius: 5 }} /></Link>
          </Box>
        </Grid>
      </Grid>

      {/* Payment & Delivery Partners */}
      <Box sx={{ borderTop: "1px solid #444", mt: 4, pt: 3, display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>Payment Partners</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" style={{ height: "25px" }} />
            <img src={rupee} alt="RuPay" style={{ height: "25px" }} />
            <img src={UPI} alt="UPI" style={{ height: "25px" }} />
            <img src="https://img-cdn.thepublive.com/filters:format(webp)/sambad-english/media/post_attachments/wp-content/uploads/2017/02/Paytm.png" alt="Paytm" style={{ height: "25px" }} />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/GooglePayLogo.width-500.format-webp.webp" alt="Google Pay" style={{ height: "25px" }} />
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>Delivery Partners</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <img src="https://shipcorrect.com/images/brand%20image/ekart.webp" alt="Ekart" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/2560px-DHL_Logo.svg.png" alt="DHL" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/FedEx_logo.jpg" alt="FedEx" style={{ height: "25px" }} />
            <img src="https://i.pinimg.com/736x/01/9b/ae/019bae205f88ece53acc960ded948490.jpg" alt="Delhivery" style={{ height: "25px" }} />
          </Box>
        </Box>
      </Box>

      {/* Copyright & Legal */}
      <Box sx={{ borderTop: "1px solid #444", mt: 3, pt: 2, textAlign: "center", pb: 2 }}>
        <Typography variant="body2">© 2007-2025  | All Rights Reserved</Typography>
        <Typography variant="caption" sx={{ color: "#bbb" }}>
          All trademarks and logos are property of their respective owners.
        </Typography>
      </Box>
    </Box>
  );



  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <Slider />


      {/* 🔹 Sections */}
      {renderSection("Top Offers", "TopTrendy", "TopTrendy", 10)}
      {renderSection("Best of Electronics", "Electronics", "Electronics", 8)}
      {renderSection("Mobiles", "Mobiles", "Mobiles", 7)}
      {renderSection("TVs & Appliances", "TvProduct", "TV", 5)}
      {renderSection("Fashion Deals", "Fashion", "Fashion", 6)}
      {renderSection("Beauty, Food, Toys & More", "MoreData", "MoreData", 5)}
      {renderSection("Sports, HealthCare & Fitness", "sports", "Sports", 5)}
      {renderSection("Furniture Bestsellers", "Furniture", "Furniture", 12)}



      {/* 🔹 Recommended */}
      {renderSection("Bestsellers / Recommended for You", "Recommended", "Recommended", 9)}


      <Footer></Footer>
    </div>
  );
}

export default Home;
