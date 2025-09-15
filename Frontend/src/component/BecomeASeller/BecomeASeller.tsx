import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../Navbar/Navbar";
import "./BecomeASeller.css";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlipkartSecImg from "../../assets/chatgptlogoone.png"
import { useNavigate } from "react-router-dom";

export default function BecomeASeller() {
    const api = import.meta.env.VITE_API_BASE_URL;
  const formRef = useRef(null);
  const navigate = useNavigate()
  const [tab, setTab] = useState(0);

  const [formData, setFormData] = useState({
    fullname: "",
    businessName: "",
    email: "",
    phone: "",
    businessAddress: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Counter states
  const [counters, setCounters] = useState({
    sellers: 0,
    products: 0,
    orders: 0,
  });

  // Animate counters
  useEffect(() => {
    const targets = { sellers: 5000, products: 12000, orders: 50000 };
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;

    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      setCounters({
        sellers: Math.floor((targets.sellers / steps) * stepCount),
        products: Math.floor((targets.products / steps) * stepCount),
        orders: Math.floor((targets.orders / steps) * stepCount),
      });
      if (stepCount >= steps) clearInterval(interval);
    }, intervalTime);
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (e) => {
    if (tab === 0) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !formData.fullname ||
      !formData.businessName ||
      !formData.email ||
      !formData.phone ||
      !formData.businessAddress ||
      !formData.password
    ) {
      toast.error("⚠ Please fill all fields!");
      return;
    }
    try {
      const res = await fetch(`${api}/seller/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "✅ Seller Registered Successfully!");
        setFormData({
          fullname: "",
          businessName: "",
          email: "",
          phone: "",
          businessAddress: "",
          password: ""
        });
      } else {
        toast.error(data.message || "❌ Registration failed!");
      }
    } catch {
      toast.error("❌ Server error. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("⚠ Please fill all fields!");
      return;
    }
    try {
      const res = await fetch(`${api}/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("✅seller Login successful!");
        navigate(`/BecomeaSeller/SellerDashboard/${data.user._id}`)
        // Store token & user


        setLoginData({
          email: "",
          password: ""
        });
      } else {
        toast.error(data.message || "❌ Login failed!");
      }
    } catch {
      toast.error("❌ Server error. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }} mt="60px">
      <Navbar Bgcolor='#a8d5e2' TextColor='black' ImageSrc={FlipkartSecImg} imageWidth="40px" />
      {/* <SellerNavbar /> */}

      {/* HERO SECTION */}
      <Box className="hero-section" >
        <Box className="hero-overlay"></Box>
        <Box className="hero-content">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Become a Seller 🚀
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.6, maxWidth: 700 }}>
            Start your online business today and reach millions of customers
            worldwide. Get fast payments, marketing support, and premium seller
            tools.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.2,
              px: 3,
              background: "linear-gradient(90deg, #2874f0, #1a5ccc)",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            onClick={scrollToForm}
          >
            Start Selling Now
          </Button>
        </Box>
      </Box>

      {/* COUNTERS SECTION */}
      <Box sx={{ py: 6, backgroundColor: "#fff" }}>
        <Grid container spacing={4} justifyContent="center" textAlign="center">
          <Grid size={3}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {counters.sellers.toLocaleString()}+
            </Typography>
            <Typography variant="h6">Active Sellers</Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {counters.products.toLocaleString()}+
            </Typography>
            <Typography variant="h6">Products Listed</Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {counters.orders.toLocaleString()}+
            </Typography>
            <Typography variant="h6">Orders Delivered</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* FORM SECTION */}
      <Box
        ref={formRef}
        pt={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 650,
            borderRadius: 4,
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            p: 2,
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered
            indicatorColor="primary"
            textColor="primary"
            sx={{
              mb: 2,
              "& .MuiTab-root": { fontWeight: "bold", fontSize: "1.1rem" },
            }}
          >
            <Tab label="Register" />
            <Tab label="Login" />
          </Tabs>
          <Divider sx={{ mb: 3 }} />

          <CardContent sx={{ px: 2 }}>
            {tab === 0 ? (
              <form onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      label="Full Name"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Business Address"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      sx={{
                        py: 1.4,
                        fontSize: "1rem",
                        background:
                          "linear-gradient(90deg, #2874f0, #1a5ccc)",
                      }}
                    >
                      Submit Application
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      sx={{
                        py: 1.4,
                        fontSize: "1rem",
                        background:
                          "linear-gradient(90deg, #2874f0, #1a5ccc)",
                      }}
                    >
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 6, backgroundColor: "#fff", mt: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          What Our Sellers Say
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
          {[
            {
              name: "Amit Sharma",
              feedback:
                "Joining this platform boosted my sales by 300% in 6 months!",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Priya Verma",
              feedback:
                "The support team is amazing. I feel like I have a dedicated growth partner.",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "Ravi Kumar",
              feedback:
                "Listing products was super easy and payments are always on time.",
              img: "https://randomuser.me/api/portraits/men/53.jpg",
            },
          ].map((seller, i) => (
            <Grid size={3} key={i}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  component="img"
                  src={seller.img}
                  alt={seller.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {seller.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  "{seller.feedback}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 6, backgroundColor: "#f9fafc" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Frequently Asked Questions
        </Typography>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid size={8}>
            {[
              {
                q: "How much does it cost to join?",
                a: "Joining is free! You only pay a small commission when you make a sale.",
              },
              {
                q: "When do I get paid?",
                a: "Payments are processed within 7 days of order delivery.",
              },
              {
                q: "Do I need GST to sell?",
                a: "Yes, GST is mandatory for selling on our platform.",
              },
            ].map((faq, i) => (
              <Accordion key={i}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
