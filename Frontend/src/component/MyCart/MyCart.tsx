// src/component/MyCart/MyCart.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import FlipkartSecImg from "../../assets/chatgptlogoone.png";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// ✅ Custom Components
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";
import CheckoutStepper from "./CheckoutStepper";

// ----------------------- Types -----------------------
type Product = {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
};

type CartItem = {
  _id: string;
  quantity: number;
  product: Product;
};

type User = {
  name: string;
};

function MyCart() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Stepper states
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  // const [activeStep, setActiveStep] = useState(0);

  // // ✅ Checkout states
  // const [address, setAddress] = useState("");
  // const [paymentMethod, setPaymentMethod] = useState("");

  const token = localStorage.getItem("token");
  const api = import.meta.env.VITE_API_BASE_URL;

  // Pricing (Flipkart-style demo values)
  const deliveryCharge = 50;
  const discount = 100;

  // ----------------------- Fetch Cart -----------------------
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user || null);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      setUser(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
    else setLoading(false);
  }, [token]);

  // ----------------------- Loading & No Token -----------------------
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!token)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Please login to view your cart.
        </Typography>
      </Box>
    );

  // ----------------------- Price Calculations -----------------------
  const totalMRP = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const finalAmount = Math.max(totalMRP + deliveryCharge - discount, 0);
  const totalSavings = discount;

  // ----------------------- Stepper -----------------------
  // const steps = ["Cart", "Delivery Address", "Payment", "Confirmation"];
  // const handleNext = () => {
  //   if (activeStep === 1 && !address) {
  //     alert("Please enter delivery address");
  //     return;
  //   }
  //   if (activeStep === 2 && !paymentMethod) {
  //     alert("Please select a payment method");
  //     return;
  //   }
  //   setActiveStep((prev) => prev + 1);
  // };
  // const handleBack = () => setActiveStep((prev) => prev - 1);

  const handlePlaceOrderClick = () => {
    setShowOrderDetails(true);
    // setActiveStep(0); // start checkout
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // ----------------------- Remove / Update -----------------------
  async function handleRemove(cartItemId: string) {
    try {
      await axios.delete(`${api}/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  }

  async function updateQuantity(cartItemId: string, newQty: number) {
    if (newQty < 1) return;
    try {
      await axios.put(
        `${api}/cart/update/${cartItemId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  }

  // ----------------------- Render -----------------------
  return (
    <Box sx={{ backgroundColor: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar
        Bgcolor="#a8d5e2"
        TextColor="white"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />

      {/* Greeting */}
      {user && (
        <Box
          sx={{
            p: 3,
            background: "#fff",
            mt: "70px",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Hi, {user.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            You have {cartItems.length} item(s) in your cart
          </Typography>
        </Box>
      )}

      <Grid container spacing={3} px={{ xs: 2, md: 3 }} py={4}>
        {/* Cart Items */}
        <Grid item lg={8}>
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <Grid container spacing={3}>
              {cartItems.map((item) => (
                <Grid item xs={12} key={item._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 },
                      p: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        minWidth: 180,
                        maxWidth: 180,
                        height: 220,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRight: "1px solid #f0f0f0",
                        pr: 2,
                      }}
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    {/* Details */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.product?.name || "No Title"}
                      </Typography>

                      <Typography
                        color="primary"
                        fontWeight="bold"
                        sx={{ mt: 1, fontSize: "18px" }}
                      >
                        ₹{item.product.price}
                      </Typography>

                      {/* Quantity */}
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <IconButton
                          size="small"
                          sx={{ border: "1px solid #ccc" }}
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography fontWeight="bold" mx={1}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ border: "1px solid #ccc" }}
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </CardContent>

                    {/* Remove */}
                    <CardActions>
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemove(item._id)}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <Grid item xs={12} md={4}>
            <OrderSummary
              cartLength={cartItems.length}
              totalMRP={totalMRP}
              discount={discount}
              deliveryCharge={deliveryCharge}
              finalAmount={finalAmount}
              totalSavings={totalSavings}
              onPlaceOrder={handlePlaceOrderClick}
            />
          </Grid>
        )}
      </Grid>

      {/* ✅ Stepper Checkout */}
      {showOrderDetails && (
        <CheckoutStepper
         
        />
      )}
    </Box>
  );
}

export default MyCart;
