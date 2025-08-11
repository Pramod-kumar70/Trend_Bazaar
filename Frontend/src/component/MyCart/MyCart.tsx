import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import CircularProgress from '@mui/material/CircularProgress';
import FlipkartSecImg from "../../assets/F4.png"

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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function MyCart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      setLoading(true); // start loading
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
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Please login to view your cart.
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", marginTop:"90px" }}>
      <Navbar Bgcolor='#2874f0' TextColor='white' ImageSrc={FlipkartSecImg} imageWidth="40px" />

      {/* User Info */}
      {user && (
        <Box
          sx={{
            p: 3,
            background: "#fff",
            mt:"90px",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {user.name}'s Shopping Cart
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Email: {user.email}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3} px={{ xs: 2, md: 3 }} pb={4} mt={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
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
              <Typography variant="h6" color="textSecondary">
                Your cart is empty 🛒
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {cartItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
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

                    {/* Content */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        noWrap
                        title={item.product.title}
                      >
                        {item.product.title}
                      </Typography>
                      <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                        ₹{item.product.price}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                          gap: 1,
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

                    {/* Remove Button */}
                    <CardActions
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
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
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: "sticky", top: 20, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Items: {cartItems.length}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Total: ₹
              {cartItems.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                textTransform: "none",
                fontSize: "16px",
                borderRadius: 2,
              }}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  // Remove Item
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

  // Update Quantity
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
