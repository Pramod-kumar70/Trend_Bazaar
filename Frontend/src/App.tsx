// App.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home/Home';
import ProductDetails from './component/ProductDetails/ProductDetails';
import SearchControl from './component/SearchControl/SearchControl';
import SearchProductDetails from './component/SearchProductDetails/SearchProductDetails';
import Login from './component/Login/Login';
import MyCart from './component/MyCart/MyCart';
import BecomeASeller from './component/BecomeASeller/BecomeASeller';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerDashboard from './component/SellerDashboard/SellerDashboard';
import AddNewProduct from './component/AddNewProduct/AddNewProduct';
import Profile from './component/Profile/Profile';
import Signup from './component/Signup/Signup';
import { Toaster } from "sonner";
function App() {

  return (
    <>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/BecomeaSeller' element={<BecomeASeller />} />
        <Route path='/cart/Details/MyCart' element={<MyCart />} />
        <Route path='/:id' element={<ProductDetails />} />
        <Route path="/search/:name" element={<SearchControl />} />
        <Route path="/search/:name/:id" element={<SearchProductDetails />} />
        <Route path='/BecomeaSeller/SellerDashboard/:id' element={<SellerDashboard />} />
        <Route path='/BecomeaSeller/SellerDashboard/AddNewProduct' element={<AddNewProduct />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={500} // thoda fast close
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
        style={{
          fontSize: "15px",
          fontWeight: "500",
          borderRadius: "8px",
          textAlign: "left"
        }}
      />

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            width: "380px",                  // Balanced width
            maxWidth: "90%",                 // Responsive
            borderRadius: "10px",            // Subtle rounded corners
            padding: "18px 20px",            // Compact spacing
            fontSize: "15px",              // Professional font size
            fontWeight: 500,                 // Medium weight (not too bold)
            background: "#ffffff",           // White background
                            // Neutral dark gray text
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)", // Soft shadow
            border: "1px solid #e5e7eb",     // Light border for structure
          },
        }}
      />
    </>
  )
}

export default App
