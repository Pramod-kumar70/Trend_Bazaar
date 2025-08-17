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
  Collapse,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function MyCart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Stepper states
  const steps = ["Cart", "Delivery Address", "Payment", "Confirmation"];
  const [activeStep, setActiveStep] = useState(0);

  const [orderData, setOrderData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    paymentMethod: ""
  });

  const token = localStorage.getItem("token");

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
    setActiveStep(1); // jump to address step
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/orders",
        {
          ...orderData,
          items: cartItems
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setActiveStep(3); // move to confirmation
      setCartItems([]);
    } catch (error) {
      console.error("Order failed:", error);
      alert("❌ Order failed, please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar
        Bgcolor="#2874f0"
        TextColor="white"
        ImageSrc={FlipkartSecImg}
        imageWidth="40px"
      />

      {user && (
        <Box
          sx={{
            p: 3,
            background: "#fff",
            mt: "70px",
            boxShadow: 1,
            borderRadius: 2
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
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                background: "#fff",
                p: 5,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: 1
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
                  "&:hover": { bgcolor: "#1e60c2" }
                }}
              >
                Shop Now
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {cartItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 }
                    }}
                  >
                    <Box
                      sx={{
                        height: "220px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff"
                      }}
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        style={{
                          maxWidth: "90%",
                          maxHeight: "90%",
                          objectFit: "contain"
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        title={item.product?.title}
                      >
                        {item.product?.title}
                      </Typography>
                      <Typography
                        color="primary"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        ₹{item.product.price}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                          gap: 1
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemove(item._id)}
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
            <Card
              sx={{
                p: 3,
                position: "sticky",
                top: 90,
                borderRadius: 2
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Price Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Price ({cartItems.length} item)
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                ₹
                {cartItems.reduce(
                  (acc, item) => acc + item.product.price * item.quantity,
                  0
                )}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: 2,
                  bgcolor: "#fb641b",
                  "&:hover": { bgcolor: "#e55300" }
                }}
                onClick={handlePlaceOrderClick}
              >
                Place Order
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Stepper Checkout */}
      <Collapse in={showOrderDetails}>
        <Paper sx={{ p: 3, m: 3, backgroundColor: "#f9f9f9" }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1 - Address */}
          {activeStep === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={orderData.fullName}
                    onChange={(e) =>
                      setOrderData({ ...orderData, fullName: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={orderData.phone}
                    onChange={(e) =>
                      setOrderData({ ...orderData, phone: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    value={orderData.pincode}
                    onChange={(e) =>
                      setOrderData({ ...orderData, pincode: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={orderData.address}
                    onChange={(e) =>
                      setOrderData({ ...orderData, address: e.target.value })
                    }
                    required
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={orderData.city}
                    onChange={(e) =>
                      setOrderData({ ...orderData, city: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={orderData.state}
                    onChange={(e) =>
                      setOrderData({ ...orderData, state: e.target.value })
                    }
                    required
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 3 }}
              >
                Save & Continue to Payment
              </Button>
            </form>
          )}

          {/* Step 2 - Payment */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Payment Method
              </Typography>
              <RadioGroup
                value={orderData.paymentMethod}
                onChange={(e) =>
                  setOrderData({ ...orderData, paymentMethod: e.target.value })
                }
              >
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Credit/Debit Card"
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => handleOrderSubmit()}
              >
                Confirm & Place Order
              </Button>
            </Box>
          )}

          {/* Step 3 - Confirmation */}
          {activeStep === 3 && (
            <Box textAlign="center">
              <Typography variant="h5" color="success.main" gutterBottom>
                ✅ Order Placed Successfully!
              </Typography>
              <Typography variant="body1">
                Thank you for shopping with us.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => {
                  setShowOrderDetails(false);
                  setActiveStep(0);
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  );

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
