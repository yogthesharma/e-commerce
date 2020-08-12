import React, { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import Fire from "../../components/firebase";
import { Container, Row, Col, Button } from "react-bootstrap";
import Axios from "axios";
// test
import firebase from "firebase/app";

const ItemId = () => {
  const [item, setItem] = useState();
  const [userInfo, setUserInfo] = useState();
  const [cartInfo, setCartInfo] = useState();
  const [orderInfo, setOrderInfo] = useState();
  const router = useRouter();
  const [temp, setTemp] = useState(false);
  const [temp2, setTemp2] = useState(false);
  const [currUser, setCurrUser] = useState();
  const [stock, setStock] = useState();
  const [counter, setCounter] = useState(1);
  const [err, setErr] = useState();

  // checking for stock
  if (temp) {
    const bNow = document.querySelectorAll(".btnDisable");
    if (counter > stock) {
      bNow[0].disabled = true;
    } else if (counter <= stock) {
      bNow[0].disabled = false;
    }
  }

  const checkUser = async () => {
    if (counter < 1) {
      return alert("We Dont Sell This many items at one time");
    }
    await Axios.post(
      "http://localhost:3000/api/addId",
      {
        userEmail: userInfo,
      },
      { headers: { purpose: "deletingItems" } }
    )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    const btnDisable = document.querySelectorAll(".btnDisable")[0];
    btnDisable.disabled = true;
    console.log(currUser);
    if (currUser) {
      return router.push("/auth/login");
    }
    router.push("/itembuy/[itemBuy]", `/itembuy/${router.query.itemId}`);
    Axios.post(
      "http://localhost:3000/api/addId",
      {
        userEmail: userInfo,
        itemId: router.query.itemId,
        unit: counter,
      },
      { headers: { purpose: "savingNumberOfItems" } }
    )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  const leftBtn = () => {
    setCounter((num) => (num = num - 1));
  };
  const rightBtn = () => {
    setCounter((num) => (num = num + 1));
  };

  // disabling btn after stocks got out
  if (stock < 1) {
    const bNow = document.querySelectorAll(".btnDisable");
    bNow[0].disabled = true;
  }

  const addToCard = async function () {
    const bNow = document.querySelectorAll(".btnDisable2");
    if (!userInfo) return router.push("/auth/login");

    var washingtonRef = Fire.firestore()
      .collection("e-commerce-user")
      .doc(cartInfo);
    console.log(cartInfo);

    const items = String(router.query.itemId);

    washingtonRef.update({
      cartItems: firebase.firestore.FieldValue.arrayUnion({ items, counter }),
    });
    alert("Item Added To Cart");
    bNow[0].disabled = true;
  };

  // effect hook starts here

  useEffect(() => {
    if (!router.query.itemId) {
      if (confirm("Session Ended")) {
        return router.back();
      }
    }

    // check login client side

    const checkUser = async () => {
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          // User is signed in.
          const email = user.email;
          console.log(email);
          setUserInfo(email);
          await Axios.post(
            "http://localhost:3000/api/userAuth",
            { email },
            {
              headers: { purpose: "userInfo" },
            }
          ).then((res) => setCartInfo(res.data.uid));
        } else {
          // No user is signed in.
          console.log("No User");
          router.push("/auth/login");
        }
      });
    };

    const getData = () => {
      Fire.firestore()
        .collection("e-commerce-data")
        .doc(router.query.itemId)
        .get()
        .then((val) => {
          setItem(val.data());
          setStock(val.data().stock);
          setTemp2(val.data().rating);
        })
        .catch((err) => router.back());
    };
    checkUser();
    getData();
    setTemp(true);

    // return () => unregisterAuthObserver();
  }, []);

  return (
    <div>
      {item ? (
        <Container className="my-5" fluid>
          <Row>
            <Col
              xs={12}
              md={6}
              style={{
                // backgroundColor: "orange",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img style={{ height: "30rem" }} src={item.pUrl} />
            </Col>
            <Col xs={12} md={6}>
              <h3>{item.pName}</h3>
              <p>{item.actualRating}&#9733;</p>
              <h1>
                <strike>&#x20B9;{item.pPrice}</strike> &#x20B9;
                {item.discountPrice}
              </h1>
              {stock > 0 ? (
                <p style={{ color: "green" }}>Stock Available</p>
              ) : (
                <p style={{ color: "red" }}>Stock Out</p>
              )}
              <br />
              <div>
                <h6 className="d-flex">
                  Colors Available:
                  {item.pColors.map((val) => (
                    <p className="mx-2">{val}</p>
                  ))}
                </h6>
              </div>
              <div>
                {item.pFeatures.map((val) => (
                  <p>{val}</p>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "40%",
                  // justifyContent: "space-evenly",
                }}
              >
                <p>Units to buy</p>
                <button onClick={leftBtn}>&#8592;</button>
                <p>{counter}</p>
                <button onClick={rightBtn}>&#8594;</button>
              </div>
              <div>
                <Button
                  className="btnDisable"
                  onClick={checkUser}
                  variant="success"
                >
                  Buy Now
                </Button>
                <Button
                  onClick={addToCard}
                  className="mx-3 btnDisable2"
                  variant="warning"
                >
                  Add To Cart
                </Button>{" "}
                <h5 className="mt-4">Reviews</h5>
                {temp2 && temp2.length > 0
                  ? temp2.map((vals) => (
                      <div className=" py-3">
                        <p>{vals.email}:</p>
                        <p>{vals.rating} &#9733;</p>
                        <h6>{vals.review}</h6>
                        <hr />
                      </div>
                    ))
                  : null}
                {item.seller ? (
                  <p className="mt-3">
                    <h5>Seller:</h5>
                    {item.seller.bName}
                    <br />
                    {item.seller.description}
                    <br />
                    Email: {item.seller.email}
                  </p>
                ) : null}
              </div>
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
};

export default ItemId;
