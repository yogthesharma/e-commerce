import React, { useState, useEffect } from "react";
import Fire from "../components/firebase";
import Axios from "axios";
import styles from "../styles/Filter.module.css";
import Link from "next/link";
import firebase from "firebase/app";
import { useRouter } from "next/router";

const CartPage = () => {
  const [temp, setTemp] = useState(true);
  const [specific, setSpecific] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [currUser, setCurrUser] = useState();

  const router = useRouter();

  const removeItem = async (id) => {
    var washingtonRef = await Fire.firestore()
      .collection("e-commerce-user")
      .doc(userInfo);
    await washingtonRef.update({
      cartItems: firebase.firestore.FieldValue.arrayRemove(id),
    });

    router.reload();
  };

  const buyNow = async (id, counter) => {
    console.log(id);
    await Axios.post(
      "http://localhost:3000/api/addId",
      {
        userEmail: currUser.email,
      },
      { headers: { purpose: "deletingItems" } }
    )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    await Axios.post(
      "http://localhost:3000/api/addId",
      {
        userEmail: currUser.email,
        itemId: id.items,
        unit: counter,
      },
      { headers: { purpose: "savingNumberOfItems" } }
    )
      .then((res) => {
        router.push("/itembuy/[itemBuy]", `/itembuy/${id.items}`);
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  const SellerAccountDetection = async () => {
    await Fire.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const email = user.email;
        await Axios.post(
          "http://localhost:3000/api/sellerAuth",
          { email },
          { headers: { purpose: "sellerInfo" } }
        )
          .then(async (res) => {
            if (
              confirm("Seller's Account Detected Logout to continue...>!!!")
            ) {
              await Fire.auth().signOut();
              router.reload();
            }
            return router.back();
          })
          .catch((e) => {
            if (e.response.data.errFlag) {
              return;
            }
          });
      }
    });
  };

  useEffect(() => {
    console.log(":", ":", ":", ":");
    if (router.pathname === "/cartPage" && router.pathname !== "/seller") {
      SellerAccountDetection();
    }

    const fetchSet = async () => {
      setSpecific([]);
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const email = await user.email;
          console.log(email);
          await Axios.post(
            "http://localhost:3000/api/userAuth",
            { email },
            {
              headers: { purpose: "userInfo" },
            }
          )
            .then((res) => {
              if (
                res.data.uoInfo.cartItems === undefined ||
                res.data.uoInfo.cartItems.length === 0
              ) {
                alert("No Items In The Cart Present");
                return router.push("/dashboard");
              }
              setUserInfo(res.data.uid);
              setCurrUser(res.data.uoInfo);

              res.data.uoInfo.cartItems.map((val) => {
                if (!val) return alert("No Items In the cart");
                Axios.post(
                  "http://localhost:3000/api/userAuth",
                  { itemId: val.items },
                  {
                    headers: {
                      purpose: "itemInfo",
                    },
                  }
                ).then(
                  async (res) =>
                    await setSpecific((specific) => [
                      ...specific,
                      { iteData: res.data, id: val, counter: val.counter },
                    ])
                );
              });
            })
            .catch((e) => console.log(e));
        } else {
          router.push("/auth/login");
        }
      });

      console.log("Doe");
      console.log(specific);
    };

    // if(!specific && !)

    fetchSet();
  }, []);

  console.log("don");
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center">
      {specific
        ? specific.map((val) => (
            <div style={{}} className={styles.otherCards}>
              <Link
                key={val.id.items}
                as={`/itemdynamic/${val.id.items}`}
                href="/itemdynamic/[itemId]"
              >
                <div
                  className="d-flex align-items-center justify-content-around m-4 flex-column"
                  style={{ width: "20rem", height: "20rem", cursor: "pointer" }}
                >
                  <img src={val.iteData.msg.pUrl} />
                  <h4 style={{ textAlign: "center", margin: "1rem 0" }}>
                    {val.iteData.msg.pName}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      width: "90%",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <h5>&#x20B9;{val.iteData.msg.pPrice}</h5> *{" "}
                    <h5>Qty. {val.counter}</h5> ={" "}
                    <h5>
                      &#x20B9;
                      {Number(val.iteData.msg.pPrice) * Number(val.counter)}
                    </h5>
                  </div>
                </div>
              </Link>
              <div
                style={{
                  width: "100%",
                  margin: "0.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  paddingTop: "0.7rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => buyNow(val.id, val.counter)}
                  style={{
                    backgroundColor: "green",
                    width: "50%",
                    height: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h6>Buy Now</h6>
                </div>

                <div
                  style={{
                    backgroundColor: "red",
                    width: "50%",
                    height: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => removeItem(val.id)}
                >
                  <h6>Remove Item</h6>
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default CartPage;

// doo the cart adding here
