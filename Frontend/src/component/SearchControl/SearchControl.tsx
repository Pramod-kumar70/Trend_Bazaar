import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import DefaultTvImg from "../../assets/DTV.png";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import FlipkartSecImg from "../../assets/F4.png"

function SearchControl() {
  const navigate = useNavigate();
  const { name } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar Bgcolor='#2874f0' TextColor='white' ImageSrc={FlipkartSecImg} imageWidth="40px" />

      <Grid container mt="90px" justifyContent={"space-evenly"}>
        {/* Filter Column */}
        <Grid size={2}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "8px",
              p: 2,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              minHeight: "300px",
              position: "sticky",
              top: "90px"
            }}
          >
            <Typography fontWeight="bold" mb={1}>
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Filter options will be here)
            </Typography>
          </Box>
        </Grid>

        {/* Products Column */}
        <Grid size={9}>
          <Grid container spacing={2}>
            {fetchedProduct.length > 0 ? (
              fetchedProduct.map((item) => (
                <Grid size={3} key={item._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)"
                      },
                      position: "relative"
                    }}
                  >
                    {/* Wishlist Icon */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#f5f5f5" }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
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
                          fontWeight: "bold"
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
                      sx={{ objectFit: "contain", p: 2, cursor: "pointer" }}
                      onClick={() => navigate(`/search/${name}/${item._id}`)}
                      onError={(e) => (e.currentTarget.src = DefaultTvImg)}
                    />

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        fontSize={16}
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          cursor: "pointer"
                        }}
                        onClick={() => navigate(`/search/${name}/${item._id}`)}
                      >
                        {item.title}
                      </Typography>

                      <Typography fontSize={14} color="text.secondary">
                        ⭐ {item.rating || "0"}
                      </Typography>

                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          ₹{item.price || "10,000"}
                        </Typography>
                        <Typography fontSize={14} sx={{ ml: 1 }}>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888"
                            }}
                          >
                            ₹{item.ActualPrice || "12,999"}
                          </span>
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        OS: {item.smartfeatures?.os || "Android TV"} <br />
                        {item.display?.resolution || "3840 x 2160"} <br />
                        Apps:{" "}
                        {item.smartfeatures?.appsSupport?.join(", ") ||
                          "Netflix, Prime, YouTube"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "green",
                          fontSize: 13,
                          fontWeight: "bold",
                          mt: 1
                        }}
                      >
                        Bank Offer Available
                      </Typography>
                    </CardContent>

                    {/* View Details Button */}
                    <Box
                      sx={{
                        p: 1,
                        borderTop: "1px solid #eee",
                        textAlign: "center"
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/search/${name}/${item._id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
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
