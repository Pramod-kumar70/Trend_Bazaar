// CheckoutPage.tsx
import  { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  
  Typography,
  Divider,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Stepper,
  Step,
  StepLabel,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";



const FLIPKART_BLUE = "#2874f0";
const FLIPKART_ORANGE = "#fb641b";
const UPI_QR_MAP: Record<string, string> = {
  gpay: "https://i.ibb.co/zHbcvJX/gpay-qr.png",
  phonepe: "https://i.ibb.co/5rB9T1D/phonepe-qr.png",
  paytm: "https://i.ibb.co/Lp7YmzW/paytm-qr.png",
};

const UPI_LOGOS: Record<string, string> = {
  gpay: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyVO9LUWF81Ov6LZR50eDNu5rNFCpkn0LwYQ&s",
  phonepe: "https://www.vhv.rs/dpng/d/411-4117619_phonepe-logo-png-phonepe-logo-transparent-background-png.png",
  paytm: "https://images.seeklogo.com/logo-png/50/1/paytm-logo-png_seeklogo-501241.png",
};

const NETBANKS = ["SBI", "HDFC", "ICICI", "Axis Bank", "Kotak Mahindra Bank"];
const ORDER_STAGES = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

type Address = {
  id: number;
  name: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string;
  label?: string;
};

type CartItem = {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    thumbnail: string;
  };
};




export default function CheckoutPage() {
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(0);
  const api = import.meta.env.VITE_API_BASE_URL;

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [selectedNetBank, setSelectedNetBank] = useState("");

  // Order
  const [orderId, setOrderId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStep, setOrderStep] = useState(0);

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const res = await axios.get(`${api}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
    // Mock addresses
    
  }, [token]);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cartItems]);
  const promoDiscount = useMemo(() => (subtotal > 30000 ? 2000 : 0), [subtotal]);
  const deliveryCharge = 0;
  const totalAmount = subtotal - promoDiscount + deliveryCharge;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (orderPlaced && orderStep < ORDER_STAGES.length - 1) {
      timer = setInterval(() => setOrderStep((s) => Math.min(s + 1, ORDER_STAGES.length - 1)), 3500);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [orderPlaced, orderStep]);

  const placeOrder = async () => {
  if (!selectedAddressId) return alert("Select address");
  if (!paymentMethod) return alert("Select payment");

  // Payment validation
  if (paymentMethod === "card") {
    const { number, expiry, cvv, name } = cardForm;
    if (!number || !expiry || !cvv || !name) return alert("Complete card details");
  }
  if (paymentMethod === "upi" && !selectedUpiApp) return alert("Select UPI app");

  const id = `ORD-${Date.now().toString().slice(-8).toUpperCase()}`;
  setOrderId(id);

  try {
    const res = await axios.post(`${api}/order/place`, {
      userId: localStorage.getItem("userId"),
      items: cartItems,
      address: selectedAddress,
      paymentMethod,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setOrderId(res.data.orderId);
    setOrderPlaced(true);
    setOrderStep(0);
    setStep(3);
  } catch (err) {
    console.error(err);
    alert("Failed to place order. Try again!");
  }
};


  const cancelOrder = () => {
    setOrderStep(-1);
    setOrderPlaced(false);
    alert("Order cancelled (mock)");
  };

  const openAddAddress = () => { setEditingAddress(null); setAddressForm({}); setAddressDialogOpen(true); };
  const openEditAddress = (addr: Address) => { setEditingAddress(addr); setAddressForm(addr); setAddressDialogOpen(true); };
  const saveAddress = () => {
    const { name, phone, pincode, city, state, addressLine } = addressForm;
    if (!name || !phone || !pincode || !city || !state || !addressLine) return alert("Fill all fields");
    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...editingAddress, ...(addressForm as Address) } : a));
      setSelectedAddressId(editingAddress.id);
    } else {
      const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;
      setAddresses(prev => [...prev, { id: newId, name: name as string, phone: phone as string, pincode: pincode as string, city: city as string, state: state as string, addressLine: addressLine as string, label: (addressForm.label as string) || "Other" }]);
      setSelectedAddressId(newId);
    }
    setAddressDialogOpen(false);
  };
  const deleteAddress = (id: number) => { setAddresses(prev => prev.filter(a => a.id !== id)); setShowDeleteConfirm(null); if (selectedAddressId === id) setSelectedAddressId(addresses[0]?.id ?? null); };

  return (
    <Box sx={{ background: "#f6f7fb", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item lg={8}>
          <Typography variant="h5" fontWeight={800} color={FLIPKART_BLUE} mb={2}>Checkout</Typography>

          {/* Step 0: Cart */}
          {step === 0 && (
            <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2, p: 2 }}>
              <Typography variant="h6" fontWeight={700}>1. Review Cart</Typography>
              <Divider sx={{ my: 1 }} />
              {loadingCart ? <Typography>Loading Cart...</Typography> :
                ""
              }
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography>Subtotal</Typography><Typography>₹{subtotal}</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography color="success.main">Discount</Typography><Typography color="success.main">- ₹{promoDiscount}</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography>Delivery</Typography><Typography>{deliveryCharge === 0 ? "Free" : deliveryCharge}</Typography></Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}><Typography>Total</Typography><Typography>₹{totalAmount}</Typography></Box>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => alert("Continue shopping (mock)")}>Continue Shopping</Button>
                <Button variant="contained" sx={{ bgcolor: FLIPKART_ORANGE }} onClick={() => setStep(1)}>Continue</Button>
              </Box>
            </Card>
          )}

          {/* Step 1: Address Selection */}
          {step === 1 && (
            <Card sx={{ mb: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={700}>2. Select Delivery Address</Typography>
              <Divider sx={{ my: 1 }} />
              {addresses.map(addr => (
                <Card key={addr.id} sx={{ border: selectedAddressId === addr.id ? `2px solid ${FLIPKART_BLUE}` : "1px solid #ddd", mb: 1, p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Radio checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} />
                    <Box>
                      <Typography fontWeight={700}>{addr.name} · {addr.label}</Typography>
                      <Typography color="text.secondary">{addr.addressLine}, {addr.city} - {addr.pincode}</Typography>
                      <Typography color="text.secondary">📞 {addr.phone}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => openEditAddress(addr)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setShowDeleteConfirm(addr.id)}><DeleteIcon /></IconButton>
                  </Box>
                </Card>
              ))}
              <Button variant="outlined" sx={{ mt: 1 }} onClick={openAddAddress}>+ Add New Address</Button>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setStep(0)}>Back</Button>
                <Button variant="contained" sx={{ bgcolor: FLIPKART_BLUE }} onClick={() => setStep(2)} disabled={!selectedAddressId}>Deliver Here</Button>
              </Box>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <Card sx={{ mb: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={700}>3. Payment</Typography>
              <Divider sx={{ my: 1 }} />
              <RadioGroup value={paymentMethod} onChange={e => { setPaymentMethod(e.target.value); setSelectedUpiApp(""); }}>
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                {paymentMethod === "upi" && (
                  <Box sx={{ mt: 1 }}>
                    <Grid container justifyContent={'space-between'}>
                      {["gpay", "phonepe", "paytm"].map(app => (
                        <Grid xs={3.7} key={app}>
                          <Button
                            variant={selectedUpiApp === app ? "contained" : "outlined"}
                            fullWidth
                            onClick={() => setSelectedUpiApp(app)}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {/* Alag alag avatar har app ke liye */}
                              <img width={"30px"} src={UPI_LOGOS[app]}   />
                              <Typography sx={{ fontSize: 12 }}>{app.toUpperCase()}</Typography>
                            </Box>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>

                    {selectedUpiApp && (
                      <Box sx={{ textAlign: "center", mt: 1 }}>
                        <Typography>Scan QR with {selectedUpiApp.toUpperCase()}</Typography>
                        <img
                          src={UPI_QR_MAP[selectedUpiApp]}
                          alt={`${selectedUpiApp} qr`}
                          style={{ width: 160, marginTop: 8 }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
                {paymentMethod === "card" && (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid xs={12}><TextField fullWidth placeholder="Card Number" value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value })} /></Grid>
                    <Grid xs={6}><TextField fullWidth placeholder="MM/YY" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} /></Grid>
                    <Grid xs={6}><TextField fullWidth placeholder="CVV" type="password" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} /></Grid>
                    <Grid xs={12}><TextField fullWidth placeholder="Name on Card" value={cardForm.name} onChange={e => setCardForm({ ...cardForm, name: e.target.value })} /></Grid>
                  </Grid>
                )}
                <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
                {paymentMethod === "netbanking" && (
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Select Bank</InputLabel>
                    <Select value={selectedNetBank} onChange={e => setSelectedNetBank(e.target.value)} label="Select Bank">
                      {NETBANKS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                    </Select>
                  </FormControl>
                )}
              </RadioGroup>
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setStep(1)}>Back</Button>
                <Button variant="contained" sx={{ bgcolor: FLIPKART_ORANGE }} onClick={placeOrder}>Place Order</Button>
              </Box>
            </Card>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && orderPlaced && (
            <Card sx={{ mb: 2, p: 2, boxShadow: 3 }}>
              <Box sx={{ display: "flex",flexDirection:"column", alignItems: "center", gap: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: "green", fontSize: 42 }} />
                <Box>
                  <Typography variant="h5" fontWeight={800}>Order Confirmed</Typography>
                  <Typography color="text.secondary">Order ID: <strong>{orderId}</strong></Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => { navigator.clipboard.writeText(orderId); alert("Copied"); }}>Copy ID</Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={700}>Delivering to:</Typography>
              {selectedAddress && <Typography>{selectedAddress.name} · {selectedAddress.phone}<br />{selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.pincode}</Typography>}
              <Typography sx={{ mt: 1 }}>Payment: <strong>{paymentMethod.toUpperCase()}</strong></Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={700}>Track your order</Typography>
              <Stepper activeStep={orderStep} sx={{ mt: 1 }}>
                {ORDER_STAGES.map(label => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {orderStep < 2 && <Button variant="outlined" color="error" onClick={cancelOrder}>Cancel Order</Button>}
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Name" value={addressForm.name ?? ""} onChange={e => setAddressForm(s => ({ ...s, name: e.target.value }))} />
            <TextField label="Mobile" value={addressForm.phone ?? ""} onChange={e => setAddressForm(s => ({ ...s, phone: e.target.value }))} />
            <TextField label="Pincode" value={addressForm.pincode ?? ""} onChange={e => setAddressForm(s => ({ ...s, pincode: e.target.value }))} />
            <TextField label="City" value={addressForm.city ?? ""} onChange={e => setAddressForm(s => ({ ...s, city: e.target.value }))} />
            <TextField label="State" value={addressForm.state ?? ""} onChange={e => setAddressForm(s => ({ ...s, state: e.target.value }))} />
            <TextField label="Address Line" multiline rows={3} value={addressForm.addressLine ?? ""} onChange={e => setAddressForm(s => ({ ...s, addressLine: e.target.value }))} />
            <TextField label="Label" value={addressForm.label ?? ""} onChange={e => setAddressForm(s => ({ ...s, label: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveAddress} variant="contained" sx={{ bgcolor: FLIPKART_BLUE }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(showDeleteConfirm)} onClose={() => setShowDeleteConfirm(null)}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" onClick={() => deleteAddress(showDeleteConfirm!)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
