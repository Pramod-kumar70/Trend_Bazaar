import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import DefaultTvImg from "../../assets/DTV.png";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import FlipkartSecImg from "../../assets/chatgptlogoone.png";

function SearchControl() {
  const navigate = useNavigate();
  const { name } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filter States
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  async function fetchProductByName() {
    try {
      let url = "";
      if (["toptrendy", "sports", "moredata"].includes(name.toLowerCase())) {
        url = `http://localhost:3001/product/viewall/${name}`;
      } else {
        url = `http://localhost:3001/product/find/${name}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const products = data.SearchedProduct || data.products || [];
      setFetchedProduct(products);

      if (products.length === 0) {
        toast.info(`No products found for "${name}"`);
      }
    } catch (err) {
      console.error("Error while fetching product by name", err);
      toast.error("Something went wrong while fetching products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (name) {
      fetchProductByName();
    }
  }, [name]);

  // 🔹 Unique brands & categories
  const allBrands = [
    ...new Set(fetchedProduct.map((p) => p.brand).filter(Boolean)),
  ];
  const allCategories = [
    ...new Set(fetchedProduct.map((p) => p.category).filter(Boolean)),
  ];

  // 🔹 Filtering Logic
  const filteredProducts = fetchedProduct.filter((item) => {
    const price = item.price || 0;
    const rating = parseFloat(item.rating) || 0;

    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const ratingMatch =
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => rating >= r);
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(item.brand);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
    const discountMatch = !onlyDiscount || (item.Offer && item.Offer > 0);

    return (
      priceMatch && ratingMatch && brandMatch && categoryMatch && discountMatch
    );
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar
        Bgcolor="#a8d5e2"
        TextColor="black"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />

      <Grid container mt="90px" spacing={2}>
        {/* 🔹 Filter Sidebar */}
        <Grid size={2} >
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
            <Typography fontWeight="bold">Brand</Typography>
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

            {/* Category Filter */}
            <Typography fontWeight="bold">Category</Typography>
            <FormGroup sx={{ maxHeight: "150px", overflowY: "auto" }}>
              {allCategories.map((cat) => (
                <FormControlLabel
                  key={cat}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, cat]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== cat)
                          );
                        }
                      }}
                    />
                  }
                  label={cat}
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
          <Grid container spacing={2}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Grid size={3} key={item._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                        transform: "translateY(-3px)",
                        transition: "0.3s",
                      },
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/search/${name}/${item._id}`)} // 🔹 Card click se navigate
                  >
                    {/* Wishlist Icon */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        zIndex: 2,
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Card click ko rok de
                        toast.success("Added to Wishlist");
                      }}
                    >
                      <FavoriteBorderIcon fontSize="small" />
                    </IconButton>

                    {/* Discount Badge */}
                    {item.Offer && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "green",
                          color: "#fff",
                          px: 1,
                          py: 0.3,
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.Offer}% OFF
                      </Box>
                    )}

                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        item.thumbnail && item.thumbnail.trim() !== ""
                          ? item.thumbnail
                          : DefaultTvImg
                      }
                      alt={item.title}
                      sx={{ objectFit: "contain", p: 2 }}
                      onError={(e) => (e.currentTarget.src = DefaultTvImg)}
                    />

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Title */}
                      <Typography
                        fontSize={15}
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title || "No Title Available"}
                      </Typography>

                      {/* Rating */}
                      <Typography
                        fontSize={13}
                        sx={{
                          display: "inline-block",
                          bgcolor: "#388e3c",
                          color: "#fff",
                          px: 0.8,
                          borderRadius: "4px",
                          fontWeight: "bold",
                          mt: 0.5,
                        }}
                      >
                        {item.rating ? `${item.rating} ★` : "No Rating"}
                      </Typography>

                      {/* Price */}
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ₹{item.price || "0"}
                        </Typography>
                        <Typography fontSize={14} sx={{ ml: 1 }}>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                            }}
                          >
                            ₹{item.ActualPrice || "0"}
                          </span>
                        </Typography>
                      </Box>

                      {/* 🔹 Highlighted Specs */}
                      <Box mt={1}>
                        <Typography fontSize={13} color="text.secondary">
                          Resolution: {item.display?.resolution || "Full HD (1920 x 1080)"}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          Screen Size: {item.display?.screensize || "43 inch"}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          OS: {item.smartfeatures?.os || "Android TV"}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          Apps:{" "}
                          {item.appsSupport?.length > 0
                            ? item.appsSupport.slice(0, 2).join(", ") + "+"
                            : "YouTube, Netflix, Prime Video"}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          Color: {item.specification?.color || "Black"}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          Launch Year: {item.specification?.lunchYear || "2023"}
                        </Typography>
                      </Box>

                      {/* Extra Info Flipkart style */}
                      <Box mt={1.5}>
                        <Typography fontSize={13} sx={{ color: "#388e3c", fontWeight: 500 }}>
                          {item.delivery || "Free Delivery"}
                        </Typography>
                        <Typography fontSize={13} sx={{ color: "#2874f0", fontWeight: 500 }}>
                          {item.offer || "Bank Offer Available"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

              ))
            ) : (
              <Typography
                textAlign="center"
                fontSize={20}
                mt={5}
                color="text.secondary"
                width="100%"
              >
                No result found
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SearchControl;
