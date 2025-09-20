import { Box } from "@mui/material";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../assets/076c4f2ee87225d7.webp";
import img2 from "../../assets/11980ec333f6aa03.webp";
import img3 from "../../assets/1558a721300c7f6d.webp";
import img4 from "../../assets/11980ec333f6aa03.webp";
import img5 from "../../assets/5b309e98775e22e4.webp";
import img6 from "../../assets/75f647d756f4726f.webp";
import img7 from "../../assets/5b309e98775e22e4.webp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Slider.css"

function Slider() {
  return (
    <Carousel
      controls={false} // ❌ No next/prev buttons
      indicators={true} // ✅ Show dots
      interval={2500} // Auto slide
      pause={false} // Auto slide without pause on hover
      style={{ marginTop: "66px", display:"none" }}
      
    >
      <Carousel.Item>
        <Box component="img" src={img7} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img4} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img5} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img3} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img6} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img2} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
      <Carousel.Item>
        <Box component="img" src={img1} sx={{height:{lg:"280px" , md:"210px" , xs:"70px" ,sm:"180px"} }} width="100%" />
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;
