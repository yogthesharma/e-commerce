import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Nav.module.css";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";
import Fire from "./firebase";

const NavBar = () => {
  const [temp, setTemp] = useState(false);
  const router = useRouter();

  const hamburgerHandler = () => {
    const navigators = document.querySelector("#navigators");
    const hamburger = document.querySelector("#hamburger");
    navigators.style.transition = "all 0.1s ease-in-out";
    if (!temp) {
      navigators.style.opacity = 1;
      navigators.style.zIndex = 99;
      hamburger.style.zIndex = 100;
      setTemp(true);
    } else if (temp) {
      navigators.style.opacity = 0;
      navigators.style.zIndex = -1;
      hamburger.style.zIndex = 0;
      setTemp(false);
    }
  };
  const removeNavigator = () => {
    const navigators = document.querySelector("#navigators");
    navigators.style.opacity = 0;
    navigators.style.zIndex = -1;
    hamburger.style.zIndex = 0;
  };

  // signing out user
  const signOut = async () => {
    await Fire.auth().signOut();
    const navigators = document.querySelector("#navigators");
    navigators.style.opacity = 0;
    navigators.style.zIndex = -1;
    hamburger.style.zIndex = 0;
    router.push("/dashboard");
  };

  return (
    <div>
      <Container id="navigators" fluid className={styles.navigators}>
        <Link href="/" prefetch={false}>
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Home
          </a>
        </Link>
        <Link href="/dashboard" prefetch={false}>
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Shop
          </a>
        </Link>
        <Link href="/auth/login" prefetch={false}>
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Login/Register
          </a>
        </Link>
        <Link href="/orders">
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Your Orders
          </a>
        </Link>
        <Link href="/cartPage">
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Cart
          </a>
        </Link>
        <Link href="/seller">
          <a
            style={{ color: "white", textDecoration: "unset" }}
            onClick={removeNavigator}
          >
            Become A Seller
          </a>
        </Link>
        <a style={{ cursor: "pointer" }} onClick={signOut}>
          Sign Out
        </a>
      </Container>
      <Container fluid className={styles.navs}>
        <Row style={{ width: "100%" }}>
          <Col
            xs={0}
            md={4}
            lg={4}
            className=" d-flex justify-content-center align-items-center"
          >
            <p className={styles.logoDiv}>My E-Commerce Site</p>
          </Col>
          <Col
            xs={6}
            md={4}
            lg={4}
            className=" d-flex justify-content-center align-items-center"
          >
            <div
              onClick={hamburgerHandler}
              id="hamburger"
              className={styles.hamburger}
            >
              <div />
              <div />
              <div />
            </div>
          </Col>
          <Col
            xs={6}
            md={4}
            lg={4}
            className=" d-flex justify-content-center align-items-center"
          >
            <Link href="/cartPage">
              <p style={{ cursor: "pointer" }} className="ml-5 mt-2">
                {" "}
                &#128722;
              </p>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavBar;
