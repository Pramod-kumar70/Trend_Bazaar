// src/component/MyCart/OrderSummary.tsx
import { Card, Typography, Divider, Box, Button } from "@mui/material";

interface OrderSummaryProps {
  cartLength: number;
  totalMRP: number;
  discount: number;
  deliveryCharge: number;
  finalAmount: number;
  totalSavings: number;
  onPlaceOrder: () => void;
}

export default function OrderSummary({
  cartLength,
  totalMRP,
  discount,
  deliveryCharge,
  finalAmount,
  totalSavings,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
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
        <Typography>Price ({cartLength} item{cartLength > 1 ? "s" : ""})</Typography>
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
        onClick={onPlaceOrder}
      >
        Place Order
      </Button>
    </Card>
  );
}
