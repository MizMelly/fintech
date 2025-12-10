import { useEffect, useState } from "react";
import "./Slider.css";

import img1 from "../assets/image1.jpg";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/image3.jpg";

const images = [img1, img2, img3];


function Slider() {
  const [current, setCurrent] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      <img src={images[current]} alt={`Slide ${current + 1}`} className="slider-image" />
    </div>
  );
}

export default Slider;