import {
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import { AiFillThunderbolt } from "react-icons/ai";
import { MdLocalOffer } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import axios from "axios";
import "./SearchProductDetails.css";
import { toast } from "sonner";
import DefaultTvImg from "../../assets/DTV.png";
import FlipkartSecImg from "../../assets/chatgptlogoone.png"


// types.ts ya isi file mein top par
export interface Product {
  _id: string;
  title?: string;
  name?: string;
  thumbnail?: string;
  rating?: number;
  price?: number;
  ActualPrice?: number;
  Offer?: number;
  category?: string;
  offerAvailable?: {
    label?: string;
    text?: string;
    term?: string;
  }[];
  smartfeatures?: {
    os?: string;
    appsSupport?: string[];
  };
  display?: {
    resolution?: string;
  };
  specification?: {
    lunchYear?: string;
  };
}



function SearchProductDetails() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [buying, setBuying] = useState(false);

  // Fetch main product details
  const fetchProductDetails = async () => {
    try {
      const res = await axios.get<{ Data: Product }>(
        `${api}/product/find/${name}/${id}`
      );
      setProduct(res.data.Data);
    } catch (err) {
      console.error("Error in SearchProductDetails page", err);
      setError("Something went wrong while fetching product details.");
      toast.error("❌ Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (category: string) => {
    try {
      const res = await axios.get<{ products: Product[] }>(
        `${api}/product/category/${category}`
      );
      setRelatedProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching related products", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [name, id]);

  useEffect(() => {
    if (product?.category) {
      fetchRelatedProducts(product.category);
    }
  }, [product]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "100px" }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>No product found</Typography>;

  // Buy Now click
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("⚠️ Please login to continue");
      navigate("/login");
      return;
    }

    try {
      setBuying(true); // <-- yaha loading start
      const res = await axios.post(
        `${api}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("🛒 Item added to your cart!");
        setAlreadyInCart(true);

        setTimeout(() => {
          navigate(`/cart/Details/MyCart`);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add item to cart");
    } finally {
      setBuying(false); // <-- loading khatam
    }
  };

  return (
    <div>
      <Navbar Bgcolor='#a8d5e2' TextColor='black' ImageSrc={FlipkartSecImg} imageWidth="40px" />
      <Grid container justifyContent={"space-evenly"} mt={"90px"}>
        {/* Product Image + Buttons */}
        <Grid size={4}>
          <img
            src={product.thumbnail?.trim() ? product.thumbnail : DefaultTvImg}
            alt={product.title}
            style={{
              width: "100%",
              objectFit: "contain",
              marginBottom: "10px",
              height: "300px",
              borderRadius: "5px"
            }}
            onError={(e) => (e.currentTarget.src = DefaultTvImg)}
          />

          <Grid container display="flex" justifyContent="space-evenly">
            <Grid size={3.5} className="HoverEffect"
              sx={{ border: "1px solid black", textAlign: 'center', py: 1.5 }}
              onClick={() =>
                toast.info("🛒 Feature coming soon!")
              }
            >
              <GrCart style={{ fontSize: "30px" }} />
            </Grid>

            <Grid size={3.5} className="HoverEffect"
              sx={{ border: "1px solid black", textAlign: 'center', py: 1.5 }}
              onClick={() =>
                toast.info("💳 EMI option will be available soon")
              }
            >
              Pay with EMI
            </Grid>

            <Grid
              size={3.5}
              className="HoverEffect"
              sx={{
                backgroundColor: "orangered",
                color: "white",
                textAlign: "center",
                py: 1.5,
                borderRadius: 1,
                cursor: buying ? "not-allowed" : "pointer",
                opacity: buying ? 0.7 : 1
              }}
              onClick={() => {
                if (!buying) {
                  if (alreadyInCart) {
                    toast.warning("📦 Already in your cart");
                    navigate(`/cart/${product._id}`);
                  } else {
                    handleBuyNow();
                  }
                }
              }}
            >
              {buying ? (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <CircularProgress size={18} sx={{ color: "white" }} />
                  Adding...
                </Box>
              ) : (
                <>
                  <AiFillThunderbolt style={{ marginRight: "5px" }} /> Buy Now
                </>
              )}
            </Grid>

          </Grid>
        </Grid>

        {/* Product Details */}
        <Grid size={7}>
          {/* Title with Show More */}
          <Box>
            <Typography
              fontSize={20}
              fontWeight="600"
              sx={{
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {product.name || product.title}
            </Typography>

            {(product.name || product.title)?.length > 50 && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  p: 0,
                  mt: 0.5,
                  color: "primary.main",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </Box>

          <Typography className="Rating fw-bold mt-2">
            {product.rating} ★
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography fontWeight="500" color="text.secondary">
            Special price
          </Typography>
          <Typography>
            <span className="fs-3 fw-bold">₹{product.price}</span>
            <span
              className="text-decoration-line-through mx-1"
              style={{ color: "gray" }}
            >
              ₹{product.ActualPrice}
            </span>
            <span className="fw-bold" style={{ color: "green" }}>
              {product.Offer}% off{" "}
            </span>
          </Typography>

          <Typography fontWeight="bold" mt={2}>
            Available offers
          </Typography>
          <ul className="UL" style={{ listStyle: "none", padding: 0, margin: 0 }} >
            {Array.isArray(product.offerAvailable) &&
              product.offerAvailable.length > 0 ? (
              product.offerAvailable.map((offer, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  <MdLocalOffer style={{ color: "green", fontSize: "20px" }} />
                  {offer?.label && <span> {offer.label}</span>}
                  {offer?.text && <span> {offer.text}</span>}
                  {offer?.term && (
                    <span style={{ color: "blue" }}> {offer.term}</span>
                  )}
                </li>
              ))
            ) : (
              <li style={{ color: "gray" }}>No offers available</li>
            )}
          </ul>

          <Typography fontWeight="bold" mt={2}>
            Specifications
          </Typography>
          <ul style={{ paddingLeft: "20px" }}>
            <li>OS: {product.smartfeatures?.os || "Android TV"}</li>
            <li>
              Resolution: {product.display?.resolution || "3840 x 2160"}
            </li>
            <li>
              Apps:{" "}
              {product.smartfeatures?.appsSupport?.join(", ") ||
                "Netflix, Prime, YouTube"}
            </li>
            <li>
              Launch Year: {product.specification?.lunchYear || "2025"}
            </li>
          </ul>
        </Grid>
      </Grid>

      {/* Related Products */}
      <Box mt={5} px={5}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Related Products
        </Typography>
        {relatedLoading ? (
          <CircularProgress />
        ) : relatedProducts.length > 0 ? (
          <>
            <Grid container justifyContent={"space-evenly"}>
              {relatedProducts
                .filter((p) => p._id !== product._id)
                .slice(0, 5)
                .map((item:Product) => (
                  <Grid size={2.2} key={item._id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0px 4px 15px rgba(0,0,0,0.2)"
                        }
                      }}
                      onClick={() =>
                        navigate(`/search/${name}/${item._id}`)
                      }
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          item.thumbnail?.trim() ? item.thumbnail : DefaultTvImg
                        }
                        alt={item.title}
                        onError={(e) =>
                          (e.currentTarget.src = DefaultTvImg)
                        }
                        sx={{ objectFit: "contain", p: 1 }}
                      />
                      <CardContent>
                        <Typography fontWeight="bold" gutterBottom noWrap>
                          {item.title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          fontSize={14}
                        >
                          {item.rating} ★
                        </Typography>
                        <Typography fontWeight="bold" color="primary">
                          ₹{item.price}{" "}
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                              fontWeight: "normal",
                              fontSize: "13px"
                            }}
                          >
                            ₹{item.ActualPrice}
                          </span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          OS: {item.smartfeatures?.os || "Android TV"} <br />
                          {item.display?.resolution ||
                            "3840 x 2160"}{" "}
                          <br />
                          Apps:{" "}
                          {item.smartfeatures?.appsSupport?.join(", ") ||
                            "Netflix, Prime, YouTube"}{" "}
                          <br />
                          Launch:{" "}
                          {item.specification?.lunchYear || "2025"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {relatedProducts.length > 4 && (
              <Box my={3} textAlign="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/search/${name}`)}
                >
                  View All Related
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary">
            No related products found.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default SearchProductDetails;
