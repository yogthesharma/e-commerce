import React from "react";
import { Carousel, Button } from "react-bootstrap";
import style from "../../styles/CaraImg.module.css";
import Link from "next/link";

const MainSection = () => {
  return (
    <div>
      <Carousel style={{ height: "100vh" }} fade={true}>
        <Carousel.Item
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            className={style.caraImages}
            src="./image1.jpg"
            alt="First slide"
          />
          <div className={style.caraDiv}>
            <h1>Best Quality For Price....</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            className={style.caraImages}
            src="./image2.jpg"
            alt="Third slide"
          />
          <div className={style.caraDiv}>
            <h1>To Enlighten Your Day....</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            className={style.caraImages}
            src="./image3.jpg"
            alt="Third slide"
          />
          <div className={style.caraDiv}>
            <h1>Made In India....</h1>
            <Link href="/dashboard">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default MainSection;
