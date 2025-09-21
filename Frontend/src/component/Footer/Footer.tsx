// src/component/Home/Footer.tsx
import { Box, Grid, Typography, Link } from "@mui/material";
import rupee from "../../assets/image copy 2.png";
import UPI from "../../assets/image copy 3.png";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#172337", color: "#fff", mt: 5, px: 0, pt: 4, pb: 0 }}>
      {/* 🔹 Footer Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          px: { xs: 2, sm: 3 },
          textAlign: { xs: "start", sm: "left" },
        }}
      >
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            ABOUT
          </Typography>
          <Typography variant="body2">Contact Us</Typography>
          <Typography variant="body2">About Us</Typography>
          <Typography variant="body2">Careers</Typography>
          <Typography variant="body2">Flipkart Stories</Typography>
          <Typography variant="body2">Press</Typography>
          <Typography variant="body2">Flipkart Wholesale</Typography>
          <Typography variant="body2">Corporate Information</Typography>
        </Grid>
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            HELP
          </Typography>
          <Typography variant="body2">Payments</Typography>
          <Typography variant="body2">Shipping</Typography>
          <Typography variant="body2">Cancellation & Returns</Typography>
          <Typography variant="body2">FAQ</Typography>
          <Typography variant="body2">Report Infringement</Typography>
        </Grid>
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            CONSUMER POLICY
          </Typography>
          <Typography variant="body2">Return Policy</Typography>
          <Typography variant="body2">Terms Of Use</Typography>
          <Typography variant="body2">Security</Typography>
          <Typography variant="body2">Privacy</Typography>
          <Typography variant="body2">Sitemap</Typography>
          <Typography variant="body2">Grievance Redressal</Typography>
          <Typography variant="body2">EPR Compliance</Typography>
        </Grid>
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            Mail Us:
          </Typography>
          <Typography variant="body2">Flipkart Internet Private Limited,</Typography>
          <Typography variant="body2">Buildings Alyssa, Begonia &</Typography>
          <Typography variant="body2">Clove Embassy Tech Village,</Typography>
          <Typography variant="body2">Outer Ring Road, Devarabeesanahalli Village,</Typography>
          <Typography variant="body2">Bengaluru, 560103,</Typography>
          <Typography variant="body2">Karnataka, India</Typography>
        </Grid>
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            Registered Office Address:
          </Typography>
          <Typography variant="body2">Flipkart Internet Private Limited,</Typography>
          <Typography variant="body2">Buildings Alyssa, Begonia &</Typography>
          <Typography variant="body2">Clove Embassy Tech Village,</Typography>
          <Typography variant="body2">Outer Ring Road, Devarabeesanahalli Village,</Typography>
          <Typography variant="body2">Bengaluru, 560103,</Typography>
          <Typography variant="body2">Karnataka, India</Typography>
          <Typography variant="body2">CIN : U51109KA2012PTC066107</Typography>
          <Typography variant="body2">Telephone: 044-45614700</Typography>
        </Grid>
        <Grid item xs={5} sm={6} md={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#878787", mb: 1 }}>
            Social
          </Typography>
          <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" }, gap: 1, mt: 1 }}>
            <Link href="#">
              <img src="https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo"
                width={"30px"} alt="Facebook" style={{ borderRadius: 5 }} />
            </Link>
            <Link href="#">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
                width={"30px"} alt="YouTube" />
            </Link>
            <Link href="#">
              <img src="https://store-images.s-microsoft.com/image/apps.26737.9007199266244427.c75d2ced-a383-40dc-babd-1ad2ceb13c86.ed1d047e-03d9-4cd8-a342-c4ade1e58951"
                width={"30px"} alt="Twitter" style={{ borderRadius: 5 }} />
            </Link>
            <Link href="#">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                width={"30px"} alt="Instagram" style={{ borderRadius: 5 }} />
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* 🔹 Payment & Delivery Partners */}
      <Box
        sx={{
          borderTop: "1px solid #444",
          mt: 4,
          pt: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
            Payment Partners
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" style={{ height: "25px" }} />
            <img src={rupee} alt="RuPay" style={{ height: "25px" }} />
            <img src={UPI} alt="UPI" style={{ height: "25px" }} />
            <img src="https://img-cdn.thepublive.com/filters:format(webp)/sambad-english/media/post_attachments/wp-content/uploads/2017/02/Paytm.png" alt="Paytm" style={{ height: "25px" }} />
            <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/GooglePayLogo.width-500.format-webp.webp" alt="Google Pay" style={{ height: "25px" }} />
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
            Delivery Partners
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
            <img src="https://shipcorrect.com/images/brand%20image/ekart.webp" alt="Ekart" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/2560px-DHL_Logo.svg.png" alt="DHL" style={{ height: "25px" }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/FedEx_logo.jpg" alt="FedEx" style={{ height: "25px" }} />
            <img src="https://i.pinimg.com/736x/01/9b/ae/019bae205f88ece53acc960ded948490.jpg" alt="Delhivery" style={{ height: "25px" }} />
          </Box>
        </Box>
      </Box>

      {/* 🔹 Copyright */}
      <Box
        sx={{
          borderTop: "1px solid #444",
          mt: 3,
          pt: 2,
          textAlign: "center",
          pb: 2,
        }}
      >
        <Typography variant="body2">© 2007-2025 | All Rights Reserved</Typography>
        <Typography variant="caption" sx={{ color: "#bbb" }}>
          All trademarks and logos are property of their respective owners.
        </Typography>
      </Box>
    </Box>
  );
}
