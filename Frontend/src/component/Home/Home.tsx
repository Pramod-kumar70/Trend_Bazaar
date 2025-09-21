import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Slider from "./../Slider/Slider";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

import Footer from "../Footer/Footer";

// 🔹 Product type define
type Product = {
  _id: string;
  title: string;
  thumbnail: string;
  Offer?: number;
};

// 🔹 API se aane wale ProductList ka type
type ProductListType = {
  [key: string]: Product[];
};

function Home() {
  const [ProductList, setProductList] = useState<ProductListType>({});
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
    margin:"10px",
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
  const SectionHeader: React.FC<{ title: string; onViewAll: () => void }> = ({
    title,
    onViewAll,
  }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        px: 1,
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{fontSize:{md:"20px" ,sm:"13px" ,xs:"17px"}}}>
        {title}
      </Typography>
      <Button variant="contained" sx={{...viewAllButtonStyle , fontSize:{md:"14px" ,sm:"13px" ,xs:"13px"}}}  onClick={onViewAll} >
        View All
      </Button>
    </Box>
  );

  const handleCardClick = (id: string) => {
    navigate(`/${id}`);
  };

  // 🔹 Reusable Section
  const renderSection = (
    title: string,
    dataKey: string,
    route: string,
    fallbackOffer = 5
  ) => {
    const items = ProductList?.[dataKey] || [];
    if (!items.length) return null;

    return (
      <Box sx={containerStyle}>
        <SectionHeader title={title} onViewAll={() => navigate(`/search/${route}`)} />
        <Grid container  justifyContent={"space-evenly"}>
          {items.map((item: Product) => (
            <Grid
              item
              xs={6}
              sm={3}
              md={3}
              lg={1.5}
              key={item._id}
              textAlign={"center"}
              sx={gridItemStyle}
              onClick={() => handleCardClick(item._id)}
             
            >
              <Box
                component="img"
                src={item.thumbnail}
                alt={item.title}
                sx={imageStyle}
              />
              <Typography fontSize={14} noWrap>
                {item.title}
              </Typography>
              <Typography fontSize={17} fontWeight={600}>
                Upto {item.Offer ?? fallbackOffer}% off
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Footer Component


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

      <Footer />
    </div>
  );
}

export default Home;

