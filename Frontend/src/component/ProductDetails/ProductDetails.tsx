import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import Navbar from "./../Navbar/Navbar";
import axios from "axios";
import DefaultTvImg from "../../assets/DTV.png";
import { MdStar } from "react-icons/md";
import FlipkartSecImg from "../../assets/chatgptlogoone.png";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_BASE_URL;

  // ✅ Filter states
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  // ✅ Get category products based on clicked product id
  async function fetchCategoryProducts() {
    try {
      const productRes = await axios.get(`${api}/product/${id}`);
      const product = productRes.data.ParticularProduct;

      if (product?.category) {
        const res = await axios.get(
          `${api}/product/category/${product.category}`
        );
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

  // ✅ Unique brands
  const allBrands = [
    ...new Set(categoryProducts.map((p) => p.brand).filter(Boolean)),
  ];

  // ✅ Filter logic
  const filteredProducts = categoryProducts.filter((item) => {
    const price = item.price || 0;
    const rating = parseFloat(item.rating) || 0;

    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const ratingMatch =
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => rating >= r);
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(item.brand);
    const discountMatch = !onlyDiscount || (item.Offer && item.Offer > 0);

    return priceMatch && ratingMatch && brandMatch && discountMatch;
  });

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 12 }}
      >
        <CircularProgress sx={{ color: "#2874f0" }} />
        <Typography variant="body1" mt={2} color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Navbar
        Bgcolor="#a8d5e2"
        TextColor="black"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />

      <Grid container spacing={2} mt={"90px"} px={2}>
        {/* 🔹 Filter Sidebar */}
        <Grid size={2}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "8px",
              p: 2,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              minHeight: "400px",
              position: "sticky",
              top: "90px",
            }}
          >
            <Typography fontWeight="bold" mb={2} sx={{ color: "#2874f0" }}>
              Filters
            </Typography>

            {/* Price Filter */}
            <Typography fontWeight="bold">Price</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
            />
            <Divider sx={{ my: 2 }} />

            {/* Rating Filter */}
            <Typography fontWeight="bold">Customer Rating</Typography>
            <FormGroup>
              {[4, 3, 2].map((r) => (
                <FormControlLabel
                  key={r}
                  control={
                    <Checkbox
                      checked={selectedRatings.includes(r)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRatings([...selectedRatings, r]);
                        } else {
                          setSelectedRatings(
                            selectedRatings.filter((val) => val !== r)
                          );
                        }
                      }}
                    />
                  }
                  label={`${r}★ & above`}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* Brand Filter */}
           
            <FormGroup sx={{ maxHeight: "150px", overflowY: "auto" }}>
              {allBrands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(
                            selectedBrands.filter((b) => b !== brand)
                          );
                        }
                      }}
                    />
                  }
                  label={brand}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* Offers Filter */}
            <Typography fontWeight="bold">Offers</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyDiscount}
                  onChange={(e) => setOnlyDiscount(e.target.checked)}
                />
              }
              label="Only with Offers"
            />
          </Box>
        </Grid>

        {/* 🔹 Products Grid */}
        <Grid size={10}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {categoryProducts.length > 0 ? categoryProducts[0].category : "Products"}
          </Typography>

          {filteredProducts.length > 0 ? (
           <Grid container spacing={2}>
  {filteredProducts.map((product) => (
    <Grid size={2.8} key={product._id}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: "10px",
          height: "100%",
          cursor: "pointer",
          transition: "0.3s",
          border: "1px solid #f0f0f0",
          "&:hover": {
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            transform: "translateY(-4px)",
          },
          position: "relative",
        }}
        onClick={() => navigate(`/search/name/${product._id}`)} // 🔹 Card click se navigate
      >
        {/* Discount Badge */}
        {product.Offer && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "#ff4343",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
              px: 1,
              py: 0.2,
              borderRadius: "4px",
            }}
          >
            {product.Offer}% OFF
          </Box>
        )}

        {/* Product Image */}
        <Box sx={{ textAlign: "center" }}>
          <Box
            component="img"
            src={product.thumbnail?.trim() ? product.thumbnail : DefaultTvImg}
            alt={product.title || "Product"}
            onError={(e) => (e.currentTarget.src = DefaultTvImg)}
            sx={{
              width: "100%",
              height: "200px",
              objectFit: "contain",
              mb: 1,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "40px",
          }}
        >
          {product.title || "No Title Available"}
        </Typography>

        {/* Rating */}
        <Box display="flex" alignItems="center" mt={0.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#388e3c",
              color: "#fff",
              px: 0.8,
              py: 0.2,
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            {product.rating ? product.rating : "No Rating"}{" "}
            <MdStar style={{ marginLeft: "3px", fontSize: "14px" }} />
          </Box>
          {product.ratingCount && (
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({product.ratingCount})
            </Typography>
          )}
        </Box>

        {/* Price Section */}
        <Box mt={1}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ₹{product.price || "10,000"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span style={{ textDecoration: "line-through", marginRight: "5px" }}>
              ₹{product.ActualPrice || "12,899"}
            </span>
            <span style={{ color: "green", fontWeight: "500" }}>
              {product.Offer || "10"}% off
            </span>
          </Typography>
        </Box>

        {/* 🔹 Highlights */}
        <Box mt={1}>
          <Typography fontSize={13} color="text.secondary">
            Resolution: {product.display?.resolution || "Full HD (1920 x 1080)"}
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Screen Size: {product.display?.screensize || "43 inch"}
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            OS: {product.smartfeatures?.os || "Android TV"}
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Apps:{" "}
            {product.appsSupport?.length > 0
              ? product.appsSupport.slice(0, 2).join(", ") + "+"
              : "YouTube, Netflix, Prime Video"}
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Color: {product.specification?.color || "Black"}
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Launch Year: {product.specification?.lunchYear || "2023"}
          </Typography>
        </Box>

        {/* Extra Info Flipkart style */}
        <Box mt={1.5}>
          <Typography fontSize={13} sx={{ color: "#388e3c", fontWeight: 500 }}>
            {product.delivery || "Free Delivery"}
          </Typography>
          <Typography fontSize={13} sx={{ color: "#2874f0", fontWeight: 500 }}>
            {product.offer || "Bank Offer Available"}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  ))}
</Grid>

          ) : (
            <Typography color="text.secondary">No products found</Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ProductDetails;
