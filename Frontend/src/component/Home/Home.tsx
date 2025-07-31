// Home Page

import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar"
import Slider from './../Slider/Slider';
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import './Home.css'

function Home() {
  const [ProductList, setProductList] = useState({})
  const [Loading, setloading] = useState(true)
  const navigate = useNavigate()
  async function getAllData() {

    try {
      const response = await fetch('http://localhost:3001/product')
      const data = await response.json()
      console.log(data);


      setProductList(data)
    } catch (err) {
      console.log('Error while fetching all deta from home page', err);

    } finally {
      setloading(false)
    }
  }


  useEffect(function () {
    getAllData();
  }, [])

  
  if (Loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <CircularProgress />
    </Box>
  }
  return (
    <div>
      <Navbar />
      <Slider />



      {/* Top Trendy */}

      <Typography variant="h5" fontWeight={700} px={3} mt={'30px'}>Top Trendy</Typography>
      <Grid container justifyContent={'space-evenly'} >
        {
          ProductList ? (ProductList.TopTrendy?.map((item) => (
            <Grid size={1.1} key={item._id} textAlign={'center'} onClick={() => navigate(`/${item._id}`)} sx={{ cursor: "pointer" }}>
              <img src={item.thumbnail} className="imgHover" style={{ objectFit: 'contain', width: "100%", borderRadius: "15px", height: '140px', marginBottom: 20 }} alt="" />
              <Typography fontSize={14}>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>upto {item.Offer || 10}% off</Typography>
            </Grid>
          ))) : ""
        }
      </Grid>



      {/* Sport and HealthCare */}

      <Typography variant="h5" fontWeight={700} px={3} my={'30px'} >Sports , HeathCare</Typography>

      <Grid container justifyContent={'space-evenly'}>
        {
          ProductList ? (ProductList.sports?.map((item) => (
            <Grid size={1.1} key={item._id} textAlign={'center'} onClick={() => navigate(`/${item._id}`)} sx={{ cursor: "pointer" }}>
              <Box component='img' src={item.thumbnail} className="imgHover" sx={{ objectFit: "cover", width: "100%", height: "140px", borderRadius: "15px" }} />
              <Typography fontSize={14}>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600}>upto {item.Offer || 5}% off</Typography>
            </Grid>
          ))) : ""
        }
      </Grid>




      {/* Beauty , food ,Toys & more */}

      <Typography variant="h5" fontWeight={700} px={3} my={'30px'} >Beauty , Food , Toys & More</Typography>

      <Grid container justifyContent={'space-evenly'} mb={3}>
        {
          ProductList ? (ProductList.MoreData?.map((item) => (
            <Grid size={1.1} key={item._id} textAlign={'center'} onClick={() => navigate(`/${item._id}`)}
              sx={{ cursor: "pointer" }}>
              <Box component='img' src={item.thumbnail} className="imgHover" sx={{ objectFit: "cover", width: "100%", height: "140px", borderRadius: "15px", }} />
              <Typography fontSize={14}>{item.title}</Typography>
              <Typography fontSize={17} fontWeight={600} >upto {item.Offer || 5}% off</Typography>
            </Grid>
          ))) : ""
        }
      </Grid>










    </div>
  )
}

export default Home