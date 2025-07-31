import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from './../Navbar/Navbar';
import DefaultTvImg from '../../assets/DTV.png'
import './SearchControl.css'


function SearchControl() {
  const { name } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProductByName() {
    try {
      const res = await fetch(`http://localhost:3001/product/find/${name}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      setFetchedProduct(data.SearchedProduct || []);
    } catch (err) {
      console.error("Error while fetching product by name", err);
      setError("Something went wrong while fetching.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (name) {
      fetchProductByName();
    }
  }, [name]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;


  
  return (
    <div>

<Navbar />

      <Grid container justifyContent={'space-evenly'} mt={3}>
        <Grid size={2} >Filter</Grid>
        <Grid size={10} container justifyContent={'space-evenly'}  rowGap={4}>

          {
            fetchedProduct.length > 0 ? (


              fetchedProduct.map((item) => (<>
                <Grid size={2} key={item._id}>
                  <img src={item.thumbnail && item.thumbnail.trim() !== "" ? item.thumbnail : DefaultTvImg }  
                  onError={(e) => e.currentTarget.src = DefaultTvImg} className="rounded-3" style={{ width: '100%',marginTop:"10px" }} alt="" />
                </Grid>
                <Grid size={6}> 
                  <Typography fontSize={18} className="fw-bold HoverEffectInTitle" >{item.title}</Typography> 
                  <Typography  className="Rating">{item.rating} ★ </Typography>
                  <ul>
                    <li>operating system: {item.smartfeatures?.os} </li>
                    <li>{item.display?.resolution || "3840 x 2160 (4K Ultra HD)"} </li>
                    <li>{item.smartfeatures?.appsSupport?.join(" , ") || " Netflix , Amazon Prime , YouTube"}</li>
                    <li>lunch year :{item.specification?.lunchYear || " 2025 "}</li>
                  </ul>
                  </Grid>

                <Grid size={3}> 
                  <Typography variant="h5" className="fw-bold"> {item.price || "10,000"} </Typography>
                  <Typography fontSize={15} > <span style={{textDecoration:"line-through"}}> {item.ActualPrice ||"12,999"} </span> {item.Offer ||"5"}%off </Typography>
                  <Typography>upto <span style={{fontWeight:"bolder"}}>2,000</span> off on exchange</Typography>

                  
                   
                  </Grid>


              </>)
              ))



              : ""
          }
        </Grid>

      </Grid>





    </div>
  );
}

export default SearchControl;
