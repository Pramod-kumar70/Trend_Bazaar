import { Box } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';
import img1 from "../../assets/076c4f2ee87225d7.webp"
import img2 from "../../assets/11980ec333f6aa03.webp"
import img3 from "../../assets/1558a721300c7f6d.webp"
import img4 from "../../assets/1bd9f11edbf77427.webp"
import img5 from "../../assets/5b309e98775e22e4.webp"
import img6 from "../../assets/75f647d756f4726f.webp"
import img7 from "../../assets/ff79341b24d091cd.webp"


function Slider() {
  return (
    <Carousel>


      <Carousel.Item interval={2000}>
        <Box component='img' src={img7} height={'250px'} width={'100%'} />
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <Box component='img' src={img4} height={'250px'} width={'100%'} />
      </Carousel.Item>

      <Carousel.Item interval={2000}>
       <Box component='img' src={img5} height={'250px'}  width={'100%'}/>
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <Box component='img' src={img3} height={'250px'} width={'100%'} />
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <Box component='img' src={img6} height={'250px'} width={'100%'} />
      </Carousel.Item>

      <Carousel.Item interval={2000}>
       <Box component='img' src={img2} height={'250px'}  width={'100%'}/>
      </Carousel.Item>

        <Carousel.Item interval={2000}>
       <Box component='img' src={img1} height={'250px'}  width={'100%'}/>
      </Carousel.Item>


    </Carousel>
  );
}

export default Slider;