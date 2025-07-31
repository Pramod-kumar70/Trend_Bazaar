
import { Route, Routes } from 'react-router-dom';

import Home from './component/Home/Home';
import ProductDetails from './component/ProductDetails/ProductDetails';
import SearchControl from './component/SearchControl/SearchControl';
function App() {

  return (
    <>

    <Routes>
      <Route path='/' element={ <Home/> }  />
       <Route path='/:id' element={ <ProductDetails /> }  />
       <Route path = "/search/:name" element = { <SearchControl/>  } />

    </Routes>

   
    </>
  )
}

export default App
