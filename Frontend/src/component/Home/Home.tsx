import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Slider from './../Slider/Slider';
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Home.css';

function Home() {
  const [ProductList, setProductList] = useState({});
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getAllData() {
    try {
      const response = await fetch('http://localhost:3001/product');
      const data = await response.json();
      setProductList(data);
    } catch (err) {
      console.log('Error while fetching all data from home page', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
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
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
  };

  // Image style
  const imageStyle = {
    objectFit: "contain",
    width: "100%",
    height: "140px",
    borderRadius: "10px",
    marginBottom: "10px",
    transition: "transform 0.3s ease"
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
      
    
      backgroundColor: "#f1f6ff77"
    }
  };

  // View All Button style
  const viewAllButtonStyle = {
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "#2874f0",
    "&:hover": {
      bgcolor: "#1565c0",
      boxShadow: "0px 6px 15px rgba(21,101,192,0.4)",
      transform: "translateY(-2px)"
    },
    transition: "all 0.2s ease",
    borderRadius: "5px",
    paddingX: 2
  };

  // Section header with View All
  const SectionHeader = ({ title, onViewAll }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 1 }}>
      <Typography variant="h5" fontWeight={700}>{title}</Typography>
      <Button variant="contained" sx={viewAllButtonStyle} onClick={onViewAll}>
        View All
      </Button>
    </Box>
  );

  const handleCardClick = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <Slider />

      {/* Top Trendy */}
      <Box sx={containerStyle}>
        <SectionHeader title="Top Trendy" onViewAll={() => navigate("/search/TopTrendy")} />
        <Grid container justifyContent={'space-evenly'}>
          {ProductList?.TopTrendy?.map((item) => (
            <Grid size={1.5} key={item._id} textAlign={'center'} sx={gridItemStyle} onClick={() => handleCardClick(item._id)}>
              <img src={item.thumbnail} alt={item.title} style={imageStyle} />
              <Typography fontSize={14} noWrap>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>Upto {item.Offer || 10}% off</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Sports & HealthCare */}
      <Box sx={containerStyle}>
        <SectionHeader title="Sports & HealthCare" onViewAll={() => navigate("/search/Sports")} />
        <Grid container justifyContent={'space-evenly'}>
          {ProductList?.sports?.map((item) => (
            <Grid size={1.5} key={item._id} textAlign={'center'} sx={gridItemStyle} onClick={() => handleCardClick(item._id)}>
              <Box component='img' src={item.thumbnail} alt={item.title} sx={imageStyle} />
              <Typography fontSize={14} noWrap>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>Upto {item.Offer || 5}% off</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Beauty, Food, Toys & More */}
      <Box sx={{ ...containerStyle, mb: 3 }}>
        <SectionHeader title="Beauty, Food, Toys & More" onViewAll={() => navigate("/search/MoreData")} />
        <Grid container justifyContent={'space-evenly'}>
          {ProductList?.MoreData?.map((item) => (
            <Grid size={1.5} key={item._id} textAlign={'center'} sx={gridItemStyle} onClick={() => handleCardClick(item._id)}>
              <Box component='img' src={item.thumbnail} alt={item.title} sx={imageStyle} />
              <Typography fontSize={14} noWrap>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>Upto {item.Offer || 5}% off</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>


      <Box sx={{ ...containerStyle, mb: 3 }}>
        <SectionHeader title="Tv" onViewAll={() => navigate("/search/TV")} />
        <Grid container justifyContent={'space-evenly'}>
          {ProductList?.TvProduct?.map((item) => (
            <Grid size={1.5} key={item._id} textAlign={'center'} sx={gridItemStyle} onClick={() => handleCardClick(item._id)}>
              <Box component='img' src={item.thumbnail} alt={item.title} sx={imageStyle} />
              <Typography fontSize={14} noWrap>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>Upto {item.Offer || 5}% off</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>


    </div>
  );
}

export default Home;
