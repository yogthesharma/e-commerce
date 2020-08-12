import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import Axios from "axios";
import Fire from "../../components/firebase";
import Loaders from "../../components/loader";
import styles from "../../styles/Forms.module.css";

const ItemBuy = () => {
  const router = useRouter();
  const [err, setErr] = useState();
  const [userInfo, setUserInfo] = useState();
  const [finalUser, setFinalUser] = useState();
  const [finalItem, setFinalItem] = useState();
  const [loading, setLoading] = useState("");
  const [uoInfo, setUoInfo] = useState("");
  const [temp, setTemp] = useState(false);
  const [selItem, setSelItem] = useState();
  const [address, setAddress] = useState({
    address: "",
    city: "",
    district: "",
    state: "",
    email: "",
    orderId: router.query.itemBuy,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const placeOrder = async (tPrice) => {
    const date = new Date();
    console.log(userInfo);
    const dateObj =
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    await Axios.post(
      "http://localhost:3000/api/addId",
      {
        tPrice,
        date: dateObj,
        unit: selItem.data.unit,
        itemId: router.query.itemBuy,
        email: userInfo,
      },
      { headers: { purpose: "placeOrder" } }
    )
      .then((res) => {
        console.log(res.data);
        alert("Order Placed");
      })
      .catch((e) => console.log(e.response.data));
  };

  const handleSubmit = async (e, price, unit) => {
    e.preventDefault();
    setLoading(true);
    console.log(address);
    address.email = userInfo;
    console.log(address);

    // await Axios.get(
    //   `http://indian-cities-api-nocbegfhqg.now.sh/cities?District=${address.district}&City=${address.city}&State=${address.state}`
    // ).then(async (res) => {
    //   if (res.data[0] === undefined) {
    //     setLoading(false);
    //     return alert("Please Fill Carefully");
    //   }

    // });
    await Axios.post("http://localhost:3000/api/userAuth", address, {
      headers: { purpose: "addAddress" },
    })
      .then((res) => setFinalUser(res.data.user))
      .catch((err) => setLoading(false));
    const totalPrice = await (Number(price) * Number(unit));
    placeOrder(totalPrice);
    setLoading(false);
    setTemp(true);
  };

  const secondOrder = async (price, unit) => {
    const totalPrice = await (Number(price) * Number(unit));
    setLoading(true);
    placeOrder(totalPrice);
    setAddress({
      ...address,
      state: uoInfo.state,
      district: uoInfo.district,
      email: uoInfo.email,
      orderId: router.query.itemBuy,
      city: uoInfo.city,
      address: uoInfo.address,
    });
    setTemp(true);
  };

  if (temp) {
    const editDetails = document.querySelector("#editDetails");
    editDetails.style.visibility = "hidden";
    Axios.post("http://localhost:3000/api/userAuth", address, {
      headers: { purpose: "addAddress" },
    })
      .then((res) => {
        setUoInfo();
        setFinalUser(res.data.user);
      })
      .catch((err) => setLoading(false));

    setTemp(false);
    setUoInfo();
    setLoading(false);
  }

  useEffect(() => {
    if (!router.query.itemBuy) {
      if (confirm("Session Ended")) {
        return router.back();
      }
    }

    const userFetch = async () => {
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const email = user.email;
          await setUserInfo(email);
          await Axios.post(
            "http://localhost:3000/api/userAuth",
            { email },
            {
              headers: {
                purpose: "userInfo",
              },
            }
          ).then(async (res) => {
            console.log(res.data.uoInfo);
            setUoInfo(res.data.uoInfo);

            await Axios.post(
              "http://localhost:3000/api/addId",
              { userEmail: res.data.uoInfo.email },
              {
                headers: { purpose: "getSelItem" },
              }
            )
              .then((res) => {
                setSelItem(res.data);
                console.log(res.data);
              })
              .catch((e) => console.log(e));
          });
        } else {
        }
      });
    };

    userFetch();

    Fire.firestore()
      .collection("e-commerce-data")
      .doc(router.query.itemBuy)
      .get()
      .then((data) => {
        setFinalItem(data.data());
        console.log(data.data());
      })
      .catch((e) => e.response.data);
    console.log(userInfo, "userInfo");
  }, []);

  return (
    <div>
      {err ? alert(err.msg) : null}
      {loading ? <Loaders condition={loading} /> : null}
      <Row
        style={{
          minHeight: "90vh",
        }}
      >
        <Col
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100%",
            }}
            src="../shopping.png"
            alt="shoppingImg"
          />
        </Col>
        <Col
          xs={12}
          md={6}
          style={{
            backgroundColor: "orange",
          }}
        >
          <div
            style={{
              backgroundColor: "orange",
              margin: " 3rem 2rem",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",
              minHeight: "40rem",
            }}
          >
            <div>
              {finalUser ? (
                <div
                  className="d-flex m-auto w-100"
                  style={{
                    width: "30rem",
                    minHeight: "30rem",
                    textAlign: "center",
                    top: "30%",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: "column",
                    padding: "2rem",
                    borderRadius: "30px",
                  }}
                >
                  Order Placed &#9989;
                  <h2>Order Details: {finalItem.pName}</h2>
                  <h5>Address:{finalUser.address}</h5>
                  <h5>City:{finalUser.city}</h5>
                  <h5>District:{finalUser.district}</h5>
                  <h5>State:{finalUser.state}</h5>
                  <Button
                    className="w-25"
                    onClick={() => router.push("/dashboard")}
                    variant="secondary"
                  >
                    Ok
                  </Button>
                </div>
              ) : null}
              {uoInfo ? (
                <Container className="d-flex flex-column  vh-100 mt-3">
                  <h1 className="mb-4">Delivery Options</h1>
                  {finalItem && selItem ? (
                    <>
                      <h5>{finalItem.pName}</h5>
                      <h5>
                        &#x20B9;{finalItem.pPrice} &#xd7; {selItem.data.unit} =
                        &#x20B9;
                        {Number(finalItem.pPrice) * Number(selItem.data.unit)}
                      </h5>
                    </>
                  ) : null}
                  <p>
                    <strong>Email</strong>: {uoInfo.email}
                  </p>
                  <p>
                    <strong>Phone Number</strong>: {uoInfo.phone}
                  </p>
                  {uoInfo.address ? (
                    <>
                      <p>
                        <strong>Address</strong>: {uoInfo.address}, <br />
                        {uoInfo.district}, {uoInfo.district} ,{uoInfo.state}
                      </p>
                      <Button
                        onClick={() =>
                          secondOrder(finalItem.pPrice, selItem.data.unit)
                        }
                      >
                        Place Order
                      </Button>
                      <br />
                      <br />
                      <p>Or Change Delivering Options</p>
                    </>
                  ) : null}

                  <div id="editDetails">
                    <Form
                      onSubmit={(e) =>
                        handleSubmit(e, finalItem.pPrice, selItem.data.unit)
                      }
                      className={styles.form}
                    >
                      <Form.Label>Address:</Form.Label>
                      <Form.Control
                        placeholder="Full Address Here"
                        name="address"
                        value={address.address}
                        onChange={handleChange}
                      ></Form.Control>
                      <Form.Label>District:</Form.Label>
                      <Form.Control
                        placeholder="District"
                        name="district"
                        value={address.district}
                        onChange={handleChange}
                      ></Form.Control>
                      <Form.Label>City:</Form.Label>
                      <Form.Control
                        placeholder="City"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                      ></Form.Control>
                      <Form.Label>State:</Form.Label>
                      <Form.Control
                        placeholder="State"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                      ></Form.Control>
                      <br />
                      <Button className="w-100" variant="success" type="submit">
                        Place Order
                      </Button>
                    </Form>
                  </div>
                </Container>
              ) : null}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ItemBuy;
<Button>Sign Out</Button>;
