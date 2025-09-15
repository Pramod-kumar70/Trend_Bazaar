import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {Box,Avatar,Button,IconButton,TextField,Select,MenuItem, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ViewListIcon from "@mui/icons-material/ViewList";
import ListAltIcon from "@mui/icons-material/ListAlt";
import './SellerDashboard.css'


interface Product {
  _id: string;
  title: string;
  category?: string;
  section?: string;
  thumbnail?: string;
  price?: number;
  Offer?: number;
  createdAt?: string;
  smartfeatures?: {
    os?: string;
  };
  specification?: {
    color?: string;
    lunchYear?: string;
  };
}



interface Seller {
  fullname?: string;
  businessName?: string;
  email?: string;
  phone?: string;
}


export default function SellerDashboard() {

    const api = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams(); // dynamic seller id from params
  const navigate = useNavigate();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    delivered: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  // UI state
  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{
        sellerDetails: Seller;
        products: Product[];
        totalOrders: number;
        delivered: number;
        pending: number;
      }>(`${api}/seller/dashboard/${id}`);

      setSeller(res.data.sellerDetails || {});
      setProducts(res.data.products || []);
      setStats({
        totalOrders: res.data.totalOrders ?? 0,
        delivered: res.data.delivered ?? 0,
        pending: res.data.pending ?? 0,
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

  // Derived lists & categories
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const filtered = products.filter((p) => {
    const matchesQ = q.trim() === "" || (p.title && p.title.toLowerCase().includes(q.toLowerCase()));
    const matchesCat = filterCategory === "all" || p.category === filterCategory;
    return matchesQ && matchesCat;
  });

  if (loading) {
    return (
      <Box className="fd-dashboard" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Loading Dashboard...</div>
        </div>
      </Box>
    );
  }

  if (!seller) {
    return (
      <Box className="fd-dashboard">
        <div style={{ textAlign: "center", padding: 40 }}>Failed to load seller data.</div>
      </Box>
    );
  }

  return (
    <Box className="fd-dashboard">
      {/* Topbar */}
      <Box className="fd-topbar">
        <div className="brand">
          <div className="logo-circle">{(seller.fullname || "S").charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Seller Hub</div>
            <div style={{ fontSize: 13, opacity: 0.95 }}>{seller.businessName || "Business"}</div>
          </div>
        </div>

        <Box sx={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/BecomeaSeller/SellerDashboard/AddNewProduct`)}
            sx={{ background: "#ff9f00", color: "#000", fontWeight: 700 }}
          >
            Add New Product
          </Button>
        </div>
      </Box>

      <Box className="fd-layout" sx={{ mt: 2 }}>
        {/* Sidebar */}
        <Box className="fd-sidebar">
          <div style={{ marginBottom: 10, fontWeight: 700 }}>Quick Menu</div>
          <div className="menu-item" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Overview</div>
          <div className="menu-item">Orders</div>
          <div className="menu-item">Products</div>
          <div className="menu-item">Analytics</div>
          <div className="menu-item">Settings</div>
        </Box>

        {/* Main */}
        <Box className="fd-main">
          {/* Seller card */}
          <Box className="fd-seller-card">
            <Avatar sx={{ width: 72, height: 72, bgcolor: "#ff9f00", fontWeight: 700 }}>
              {(seller.fullname || "S").charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{seller.fullname}</div>
              <div style={{ color: "#666", marginTop: 4 }}>{seller.businessName}</div>
              <div style={{ color: "#666", marginTop: 6, fontSize: 13 }}>{seller.email} • {seller.phone}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#888" }}>Total Products</div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{products.length}</div>
            </div>
          </Box>

          {/* Stats */}
          <Box className="fd-stats">
            <div className="fd-stat products">
              <div className="icon"><Inventory2Icon /></div>
              <div className="meta">
                <div style={{ fontSize: 13, color: "#777" }}>Products Added</div>
                <div className="num">{products.length}</div>
              </div>
            </div>

            <div className="fd-stat orders">
              <div className="icon"><ShoppingCartIcon /></div>
              <div className="meta">
                <div style={{ fontSize: 13, color: "#777" }}>Orders Received</div>
                <div className="num">{stats.totalOrders ?? 0}</div>
              </div>
            </div>

            <div className="fd-stat delivered">
              <div className="icon"><LocalShippingIcon /></div>
              <div className="meta">
                <div style={{ fontSize: 13, color: "#777" }}>Delivered</div>
                <div className="num">{stats.delivered ?? 0}</div>
              </div>
            </div>

            <div className="fd-stat pending">
              <div className="icon"><HourglassEmptyIcon /></div>
              <div className="meta">
                <div style={{ fontSize: 13, color: "#777" }}>Pending</div>
                <div className="num">{stats.pending ?? ((stats.totalOrders ?? 0) - (stats.delivered ?? 0))}</div>
              </div>
            </div>
          </Box>

          {/* Actions: search + filter + view mode */}
          <Box className="fd-actions" sx={{ mt: 1, mb: 1 }}>
            <TextField
              size="small"
              placeholder="Search products by title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ minWidth: 280, background: "#fff", borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon /></InputAdornment>
                ),
              }}
            />

            <Select
              size="small"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{ minWidth: 160, background: "#fff", borderRadius: 1 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <IconButton color={viewMode === "list" ? "primary" : "default"} onClick={() => setViewMode("list")}><ListAltIcon /></IconButton>
              <IconButton color={viewMode === "grid" ? "primary" : "default"} onClick={() => setViewMode("grid")}><ViewListIcon /></IconButton>
            </div>
          </Box>

          {/* Products area */}
          <Box className="fd-products">
            {filtered.length === 0 ? (
              <div style={{ padding: 16, color: "#777" }}>No products found.</div>
            ) : viewMode === "list" ? (
              filtered.map((prod) => (
                <div className="fd-product-row" key={prod._id}>
                  <div className="fd-product-thumb">
                    <img src={prod.thumbnail} alt={prod.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="fd-product-info">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ maxWidth: "65%" }}>
                        <div style={{ fontWeight: 800 }}>{prod.title}</div>
                        <div style={{ color: "#666", marginTop: 6 }}>{prod.category} • {prod.section}</div>
                        <div style={{ marginTop: 8, color: "#555" }}>
                          {prod.specification?.color && <span>Color: {prod.specification.color} • </span>}
                          {prod.specification?.lunchYear && <span>Launched: {prod.specification.lunchYear} • </span>}
                          {prod.smartfeatures?.os && <span>OS: {prod.smartfeatures.os}</span>}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div className="fd-price">₹{prod.price}</div>
                        <div style={{ marginTop: 6 }}>
                          <span className="fd-offer">{prod.Offer ? `${prod.Offer}% OFF` : ""}</span>
                        </div>
                        <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>{new Date(prod.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // grid view: show cards
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
                {filtered.map((prod) => (
                  <div key={prod._id} style={{ background: "#fff", padding: 10, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src={prod.thumbnail} alt={prod.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 800, minHeight: 40 }}>{prod.title}</div>
                      <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}>{prod.category}</div>
                      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: "#388e3c", fontWeight: 700 }}>₹{prod.price}</div>
                        <div style={{ color: "#ff6f00", fontWeight: 700 }}>{prod.Offer ? `${prod.Offer}%` : ""}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
