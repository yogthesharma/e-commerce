import React, { useEffect, useState } from "react";
import SellerNav from "../../components/SellerNav";
import Axios from "axios";
import Fire from "../../components/firebase";
import { useRouter } from "next/router";
import Loaders from "../../components/loader";
import { Form, Button } from "react-bootstrap";
import styles from "../../styles/Forms.module.css";
import stylee from "../../styles/SellerItems.module.css";

const SellerItems = () => {
  const [items, setItems] = useState([]);
  const [temp, setTemp] = useState(false);

  const router = useRouter();
  let arr = [];
  const initValues = {
    pName: "",
    pFeatures: [],
    pPrice: "",
    pColors: [],
    pUrl: "",
    discountPrice: "",
    stock: "",
    keywords: [],
  };
  const [values, setValues] = useState(initValues);

  // form configurations
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "text") {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Axios.post("http://localhost:3000/api/sellerAuth", values, {
      headers: { purpose: "updateItem" },
    })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e.response.data));
    router.reload();
  };

  // form configurations

  const deleteItem = async (id) => {
    setTemp(true);
    console.log(id);
    await Axios.post(
      "http://localhost:3000/api/sellerAuth",
      { id },
      {
        headers: { purpose: "deleteItem" },
      }
    )
      .then((res) => {
        console.log(res.data);
        router.reload();
      })
      .catch((e) => console.log(e.response.data));

    setTemp(false);
  };

  const updateItem = (
    id,
    pName,
    pFeatures,
    pColors,
    discountPrice,
    pPrice,
    keywords,
    stock,
    pUrl
  ) => {
    window.scrollTo(0, 0);
    const formRef = document.querySelector("#formDiv");
    formRef.style.visibility = "visible";
    const features = pFeatures.reduce((acc, val) => acc + "," + val);
    const colors = pColors.reduce((acc, val) => acc + "," + val);
    const keys = keywords.reduce((acc, val) => acc + "," + val);
    setValues({
      ...values,
      pName,
      stock,
      discountPrice,
      pPrice,
      pFeatures: features,
      keywords: keys,
      pColors: colors,
      id,
      pUrl,
    });
  };
  const removeForm = () => {
    const formRef = document.querySelector("#formDiv");
    formRef.style.visibility = "hidden";
  };

  const resetFields = () => {
    setValues(initValues);
  };

  useEffect(() => {
    setItems([]);
    const getSellerInfo = async () => {
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const email = user.email;
          await Axios.post(
            "http://localhost:3000/api/sellerAuth",
            { email },
            {
              headers: { purpose: "sellerList" },
            }
          )
            .then((res) => {
              console.log(res.data.uoInfo);
              res.data.uoInfo.map((val) => {
                Fire.firestore()
                  .collection("e-commerce-data")
                  .doc(val)
                  .get()
                  .then((res) => {
                    setItems((items) => [
                      ...items,
                      { body: res.data(), id: res.id },
                    ]);
                  });
              });
            })
            .catch((e) => console.log(e.response.data));
        } else {
        }
      });
    };
    getSellerInfo();
    console.log(items);
  }, []);

  console.log(items);

  return (
    <>
      {temp ? <Loaders /> : null}
      <SellerNav />
      <>
        <div id="formDiv" className={styles.cartFrom}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <a
              style={{
                cursor: "pointer",
              }}
              onClick={removeForm}
            >
              &#x2716;
            </a>
          </div>
          <Form onSubmit={handleSubmit} style={{ marginBottom: "10rem" }}>
            <h2>Edit Product Here</h2>
            <Form.Label>Product's Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write The Name Of The Respective Product Here"
              name="pName"
              value={values.pName}
              onChange={handleChange}
            />
            <br />
            <Form.Label>Product's Features</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write The Features Of The Respective Product Here (Seprated By Commas)"
              name="pFeatures"
              value={values.pFeatures}
              onChange={handleChange}
            />
            <br />
            <Form.Label>Product's Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write The Price Of The Respective Product Here"
              name="pPrice"
              value={values.pPrice}
              onChange={handleChange}
            />
            <br />
            <Form.Label>Product's Colors</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write The Colours Of The Respective Product Here (Seprated By Commas)"
              name="pColors"
              value={values.pColors}
              onChange={handleChange}
            />{" "}
            <br />
            <Form.Label>Discounted Price</Form.Label>
            <Form.Control
              type="text"
              // placeholder="Write The Colours Of The Respective Product Here (Seprated By Commas)"
              name="discountPrice"
              value={values.discountPrice}
              onChange={handleChange}
            />{" "}
            <br />
            <Form.Label>Total Stock</Form.Label>
            <Form.Control
              type="text"
              // placeholder="Write The Colours Of The Respective Product Here (Seprated By Commas)"
              name="stock"
              value={values.stock}
              onChange={handleChange}
            />
            <br />
            <Form.Label>Keywords</Form.Label>
            <Form.Control
              type="text"
              // placeholder="Write The Colours Of The Respective Product Here (Seprated By Commas)"
              name="keywords"
              value={values.keywords}
              onChange={handleChange}
            />
            <br />
            <Button variant="secondary" type="submit">
              Update Item
            </Button>{" "}
            <Button variant="secondary" onClick={resetFields}>
              Reset Fields
            </Button>
          </Form>
        </div>
      </>

      <div className="d-flex flex-column w-100 flex-wrap align-items-center justify-content-center">
        {items ? (
          items.map((item) => (
            <div className={stylee.itemContainer}>
              <div className="d-flex align-items-center justify-content-around m-4 ">
                <img style={{ width: "20%" }} src={item.body.pUrl} />
                <bt />
                <div className="mt-4 ml-4">
                  <h5>{item.body.pName}</h5>
                  <p>
                    Rs.{item.body.pPrice} Rs.{item.body.discountPrice}
                    <br />
                    Stocks Remaining: {item.body.stock} Units
                  </p>
                  <p></p>
                </div>
              </div>
              <div className={stylee.insideItemConainer}>
                <a
                  onClick={() =>
                    updateItem(
                      item.id,
                      item.body.pName,
                      item.body.pFeatures,
                      item.body.pColors,
                      item.body.discountPrice,
                      item.body.pPrice,
                      item.body.keywords,
                      item.body.stock,
                      item.body.pUrl
                    )
                  }
                  style={{
                    color: "orange",
                    cursor: "pointer",
                    margin: "0 1rem",
                  }}
                >
                  Edit Item
                </a>
                <a
                  onClick={() => deleteItem(item.id)}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    margin: "0 2rem",
                  }}
                >
                  Delete Item
                </a>
              </div>
            </div>
          ))
        ) : (
          <>
            <h1>No Item</h1>
          </>
        )}
      </div>
    </>
  );
};

export default SellerItems;
