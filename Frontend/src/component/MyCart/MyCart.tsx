import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import FlipkartSecImg from "../../assets/F4.png";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function MyCart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Stepper states
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // ✅ Checkout states
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const token = localStorage.getItem("token");

  // Pricing (Flipkart-style demo values)
  const deliveryCharge = 50;
  const discount = 100;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/cart", {
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Please login to view your cart.
        </Typography>
      </Box>
    );
  }

  const handlePlaceOrderClick = () => {
    setShowOrderDetails(true);
    setActiveStep(0); // start checkout
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const totalMRP = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const finalAmount = Math.max(totalMRP + deliveryCharge - discount, 0);
  const totalSavings = discount;

  // ✅ Stepper labels
  const steps = ["Cart", "Delivery Address", "Payment", "Confirmation"];

  const handleNext = () => {
    if (activeStep === 1 && !address) {
      alert("Please enter delivery address");
      return;
    }
    if (activeStep === 2 && !paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ backgroundColor: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar
        Bgcolor="#2874f0"
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
        <Grid item xs={12} md={7}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                background: "#fff",
                p: 5,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <img
                src="https://rukminim2.flixcart.com/www/800/800/promos/cart-empty.png"
                alt="Empty Cart"
                style={{ width: "150px", marginBottom: "15px" }}
              />
              <Typography variant="h6" color="textSecondary">
                Your cart is empty 🛒
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  textTransform: "none",
                  bgcolor: "#2874f0",
                  "&:hover": { bgcolor: "#1e60c2" },
                }}
              >
                Shop Now
              </Button>
            </Box>
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
                        alt={item.product.title}
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
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                p: 3,
                position: "sticky",
                top: 90,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Price Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>
                  Price ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
                </Typography>
                <Typography>₹{totalMRP}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Discount</Typography>
                <Typography color="success.main">- ₹{discount}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Delivery Charges</Typography>
                <Typography>₹{deliveryCharge}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography fontWeight="bold">Total Amount</Typography>
                <Typography fontWeight="bold">₹{finalAmount}</Typography>
              </Box>

              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                You will save ₹{totalSavings} on this order!
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: 2,
                  bgcolor: "#fb641b",
                  "&:hover": { bgcolor: "#e55300" },
                }}
                onClick={handlePlaceOrderClick}
              >
                Place Order
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* ✅ Stepper Checkout */}
      {showOrderDetails && (
        <Box sx={{ p: 3, mt: 2, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3 }}>
            {activeStep === 0 && (
              <Typography>Your cart summary is shown above 👆</Typography>
            )}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6">Enter Delivery Address</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                  placeholder="House No, Street, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Box>
            )}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Payment Method
                </Typography>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                  <FormControlLabel value="upi" control={<Radio />} label="UPI / Wallets" />
                  <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
                  <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
                </RadioGroup>
              </Box>
            )}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" color="success.main">
                  ✅ Order Placed Successfully!
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Payment: {paymentMethod.toUpperCase()} <br />
                  Delivering to: {address}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Continue
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  // Remove
  async function handleRemove(cartItemId) {
    try {
      await axios.delete(`http://localhost:3001/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  }

  // Quantity Update
  async function updateQuantity(cartItemId, newQty) {
    if (newQty < 1) return;
    try {
      await axios.put(
        `http://localhost:3001/cart/update/${cartItemId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  }
}

export default MyCart;



