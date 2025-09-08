import { Box, Typography, Button } from "@mui/material";

export default function EmptyCart() {
  return (
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
  );
}
