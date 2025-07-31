
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import Navbar from './../Navbar/Navbar';
import { Typography } from '@mui/material';
function ProductDetails() {

  const { id } = useParams();
  const [ParticularItem, setParticulatItem] = useState(null)

  async function getProductById() {

    try {
      const res = await fetch(`http://localhost:3001/product/${id}`);
      const data = await res.json();
      console.log(data);
      setParticulatItem(data.ParticularProduct)
    } catch (error) {
      console.log("Error while fetching the Particulat Product by id", error);


    }


  }

  useEffect(function () {
    getProductById()
  }, [])

  if (!ParticularItem) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <Navbar />
      <Grid container mt={3}>
        <Grid size={2}>Filter</Grid>
        <Grid container size={7.5} justifyContent={'space-evenly'}>
          <Grid size={4}> <Box component='img' src={ParticularItem.thumbnail} sx={{ width: "100%" }} /> </Grid>
          <Grid size={7}> <Typography variant='h4'>{ParticularItem.title}</Typography> </Grid>

        </Grid>
        <Grid><Typography variant='h4'>{ParticularItem.price}</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default ProductDetails