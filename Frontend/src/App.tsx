
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
function App() {

  return (
    <>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element= { <Profile/> } />
        <Route path='/BecomeaSeller' element={<BecomeASeller />} />
        <Route path='/cart/Details/MyCart' element={<MyCart />} />
        <Route path='/:id' element={<ProductDetails />} />
        <Route path="/search/:name" element={<SearchControl />} />
        <Route path="/search/:name/:id" element={<SearchProductDetails />} />
        <Route path='/BecomeaSeller/SellerDashboard/:id' element = { <SellerDashboard/> } />
        <Route path='/BecomeaSeller/SellerDashboard/AddNewProduct' element ={ <AddNewProduct/> } />

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


    </>
  )
}

export default App
