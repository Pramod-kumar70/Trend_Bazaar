import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography, Paper, CircularProgress } from '@mui/material';
import Navbar from './../Navbar/Navbar';
import axios from "axios";
import DefaultTvImg from "../../assets/DTV.png";
import { MdStar } from "react-icons/md";
import FlipkartSecImg from "../../assets/F4.png"

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get category products based on clicked product id
  async function fetchCategoryProducts() {
    try {
      // 1️⃣ Get clicked product
      const productRes = await axios.get(`http://localhost:3001/product/${id}`);
      const product = productRes.data.ParticularProduct;

      if (product?.category) {
        // 2️⃣ Fetch all products of that category
        const res = await axios.get(`http://localhost:3001/product/category/${product.category}`);
        setCategoryProducts(res.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 12 }}>
        <CircularProgress sx={{ color: "#2874f0" }} />
        <Typography variant="body1" mt={2} color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Navbar Bgcolor='#2874f0' TextColor='white' ImageSrc={FlipkartSecImg} imageWidth="40px" />

      <Box  px={4} mt={"90px"}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {categoryProducts.length > 0 ? categoryProducts[0].category : "Products"}
        </Typography>

        {categoryProducts.length > 0 ? (
          <Grid container spacing={2}>
            {categoryProducts.map(product => (
              <Grid size={3} key={product._id}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: "8px", height: "100%" }}>

                  {/* Product Image */}
                  <div style={{textAlign:"center"}}>
                    <Box
                      component="img"
                      src={product.thumbnail?.trim() ? product.thumbnail : DefaultTvImg}
                      alt={product.title}
                      onError={(e) => (e.currentTarget.src = DefaultTvImg)}
                      sx={{
                        width: "90%",
                        height: "200px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        
                        mb: 2
                      }}
                    />

                  </div>


                  {/* Product Title */}
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {product.title}
                  </Typography>

                  {/* Rating */}
                  {product.rating && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "#388e3c",
                          color: "#fff",
                          px: 0.8,
                          py: 0.2,
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {product.rating} <MdStar style={{ marginLeft: "3px", fontSize: "16px" }} />
                      </Box>
                      {product.ratingCount && (
                        <Typography variant="body2" color="text.secondary" ml={1}>
                          ({product.ratingCount})
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Price */}
                  <Typography variant="h6" sx={{ color: "green", mt: 0.5 }}>
                    ₹{product.price}{" "}
                    {product.ActualPrice && (
                      <span style={{ textDecoration: "line-through", color: "gray", fontSize: "14px", marginLeft: "5px" }}>
                        ₹{product.ActualPrice}
                      </span>
                    )}
                  </Typography>

                  {/* Product Short Details */}
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <strong>OS:</strong> {product.smartfeatures?.os || "N/A"} <br />
                    <strong>Resolution:</strong> {product.display?.resolution || "N/A"} <br />
                    <strong>Apps:</strong> {Array.isArray(product.smartfeatures?.appsSupport) ? product.smartfeatures.appsSupport.join(", ") : "N/A"} <br />
                    <strong>Launch Year:</strong> {product.specification?.lunchYear || "N/A"}
                  </Typography>

                  {/* View Details Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, borderColor: "#2874f0", color: "#2874f0" }}
                    onClick={() => navigate(`/search/name/${product._id}`)}
                  >
                    View Details
                  </Button>

                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No products found</Typography>
        )}
      </Box>
    </div>
  );
}

export default ProductDetails;
