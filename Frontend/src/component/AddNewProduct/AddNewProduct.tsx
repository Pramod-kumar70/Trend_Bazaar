import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Divider,
  Grid,

  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import SellerNavbar from "../SellerNavbar/SellerNavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const categories = [
  "Electronics",
  "Fashion",
  "Home Appliances",
  "Books",
  "Toys",
  "Beauty",
];

export default function AddNewProduct() {
  const api = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState({
    title: "",
    price: "",
    ActualPrice: "",
    Offer: "",
    rating: "",
    category: "",
    section: "",
    display: { resolution: "", screensize: "" },
    smartfeatures: { os: "" },
    appsSupport: "",
    specification: { color: "", lunchYear: "" },
    offerAvailable: [{ name: "" }],
    brand: "",
    stock: "",
    warranty: "",
    highlights: "",
    tags: "",
    thumbnail: "", // only image URL
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleOfferChange = (index: number, value: string) => {
    const updatedOffers = [...product.offerAvailable];
    updatedOffers[index].name = value;
    setProduct((prev) => ({ ...prev, offerAvailable: updatedOffers }));
  };

  const addOfferField = () => {
    setProduct((prev) => ({
      ...prev,
      offerAvailable: [...prev.offerAvailable, { name: "" }],
    }));
  };

  const removeOfferField = (index: number) => {
    const updatedOffers = [...product.offerAvailable];
    updatedOffers.splice(index, 1);
    setProduct((prev) => ({ ...prev, offerAvailable: updatedOffers }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Seller object stored in localStorage as stringified JSON, parse it first
    const sellerObjString = localStorage.getItem("user");
    if (!sellerObjString) {
      alert("Seller not logged in!");
      return;
    }

    let sellerObj;
    try {
      sellerObj = JSON.parse(sellerObjString);
    } catch {
      alert("Invalid seller data in localStorage!");
      return;
    }

    const payload = {
      ...product,
      seller: sellerObj.id, // Only send seller's ObjectId string here
      appsSupport: product.appsSupport
        ? product.appsSupport.split(",").map((a) => a.trim())
        : [],
      highlights: product.highlights
        ? product.highlights.split(",").map((i) => i.trim())
        : [],
      tags: product.tags ? product.tags.split(",").map((tag) => tag.trim()) : [],
    };

    console.log("Payload to send:", payload);

    try {
      await axios.post(`${api}/seller/SellerAddProduct`, payload);

      toast.success("✅ Product added successfully!");
      navigate(`/BecomeaSeller/SellerDashboard/${sellerObj.id}`);
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("❌ Failed to add product");
    }
  };

  const themeColor = darkMode ? "#1e1e1e" : "#f1f3f6";
  const paperBg = darkMode ? "#2c2c2c" : "#fff";
  const textColor = darkMode ? "#fff" : "#000";

  return (
    <>
      <SellerNavbar />
      <Box sx={{ p: 3, bgcolor: themeColor, minHeight: "100vh" }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(_, checked) => setDarkMode(checked)}
              color="default"
            />
          }
          label={darkMode ? <Brightness4 /> : <Brightness7 />}
          sx={{ mb: 2 }}
        />
        <Paper
          elevation={4}
          sx={{
            maxWidth: 1000,
            mx: "auto",
            borderRadius: 3,
            p: 4,
            backgroundColor: paperBg,
            color: textColor,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="#2874f0" gutterBottom>
            🛍️ Add New Product
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Title"
                  name="title"
                  fullWidth
                  required
                  value={product.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Price (₹)"
                  name="price"
                  type="number"
                  fullWidth
                  required
                  value={product.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Actual Price (₹)"
                  name="ActualPrice"
                  type="number"
                  fullWidth
                  value={product.ActualPrice}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Discount (%)"
                  name="Offer"
                  type="number"
                  fullWidth
                  value={product.Offer}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Rating (0-5)"
                  name="rating"
                  type="number"
                  fullWidth
                  value={product.rating}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  fullWidth
                  required
                  value={product.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Section"
                  name="section"
                  placeholder="e.g. Best of Electronics"
                  fullWidth
                  value={product.section}
                  onChange={handleChange}
                />
              </Grid>

              {/* Branding & Stock Info */}
              <Grid item xs={12}>
                <Divider>
                  <Typography fontWeight="bold">Branding & Stock Info</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Brand Name"
                  name="brand"
                  fullWidth
                  value={product.brand}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Stock Available"
                  name="stock"
                  type="number"
                  fullWidth
                  value={product.stock}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Warranty"
                  name="warranty"
                  fullWidth
                  value={product.warranty}
                  onChange={handleChange}
                />
              </Grid>

              {/* Product Image */}
              <Grid item xs={12}>
                <Divider>
                  <Typography fontWeight="bold">Product Image</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Image URL"
                  name="thumbnail"
                  fullWidth
                  value={product.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              {/* Display & Features */}
              <Grid item xs={12}>
                <Divider>
                  <Typography fontWeight="bold">Display & Features</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Resolution"
                  name="display.resolution"
                  fullWidth
                  value={product.display.resolution}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Screen Size (inches)"
                  name="display.screensize"
                  fullWidth
                  value={product.display.screensize}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Operating System"
                  name="smartfeatures.os"
                  fullWidth
                  value={product.smartfeatures.os}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Apps Support (comma separated)"
                  name="appsSupport"
                  fullWidth
                  value={product.appsSupport}
                  onChange={handleChange}
                />
              </Grid>

              {/* Specifications */}
              <Grid item xs={12}>
                <Divider>
                  <Typography fontWeight="bold">Specifications</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Color"
                  name="specification.color"
                  fullWidth
                  value={product.specification.color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Launch Year"
                  name="specification.lunchYear"
                  fullWidth
                  value={product.specification.lunchYear}
                  onChange={handleChange}
                />
              </Grid>

              {/* Highlights */}
              <Grid item xs={12}>
                <TextField
                  label="Highlights (comma separated)"
                  name="highlights"
                  fullWidth
                  value={product.highlights}
                  onChange={handleChange}
                />
              </Grid>

              {/* Offers */}
              <Grid item xs={12}>
                <Divider>
                  <Typography fontWeight="bold">Offers Available</Typography>
                </Divider>
              </Grid>
              {product.offerAvailable.map((offer, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={idx}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <TextField
                    fullWidth
                    label={`Offer #${idx + 1}`}
                    value={offer.name}
                    onChange={(e) => handleOfferChange(idx, e.target.value)}
                  />
                  {product.offerAvailable.length > 1 && (
                    <Tooltip title="Remove this offer">
                      <IconButton
                        onClick={() => removeOfferField(idx)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button startIcon={<AddIcon />} onClick={() => addOfferField()}>
                  Add More Offers
                </Button>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <TextField
                  label="Product Tags (comma separated)"
                  name="tags"
                  fullWidth
                  value={product.tags}
                  onChange={handleChange}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#2874f0",
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "16px",
                    mt: 2,
                  }}
                >
                  Submit Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
}
