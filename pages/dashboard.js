import React, { useEffect, useState } from "react";
import Fire from "../components/firebase";
import styles from "../styles/Filter.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import Axios from "axios";
// import SellerAccountDetection from "../helpers/sellerAccountDetection";

const DashBoard = () => {
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState();
  const [search, setSearch] = useState();
  const arr = [];

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.value === null)
      return alert("Please enter some value before searching");
    console.log(fetchedData);
    await Axios.post(
      "http://127.0.0.1:3000/api/fireSearch",
      { search },
      {
        headers: {
          purpose: "searchItems",
        },
      }
    )
      .then((res) => {
        if (res.data.errFlag) return alert(res.data.msg);
        console.log(res.data.arr);
        setFetchedData(res.data.arr);
      })
      .catch((e) => console.log(e.response.data));
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
    console.log(process.env.PORT);
    if (router.pathname === "/dashboard" && router.pathname !== "/seller") {
      SellerAccountDetection();
    }
    const fetchData = async () => {
      await Fire.firestore()
        .collection("e-commerce-data")
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            arr.push({ id: doc.id, data: doc.data() })
          );
        });
      setFetchedData(arr);
    };
    fetchData();
  }, []);

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "orange",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              placeholder="Search"
              value={search}
              onChange={handleChange}
            />
          </Form>
        </div>
      </div>
      <div className={styles.mainDiv}>
        {fetchedData
          ? fetchedData.map((val) => (
              <Link
                key={val.id}
                as={`/itemdynamic/${val.id}`}
                href="/itemdynamic/[itemId]"
              >
                <div
                  className={styles.cardDiv}
                  // onClick={() => <ItemContext idVal={val.id} />}
                >
                  <div>
                    {val.data.actualRating ? (
                      <p>{val.data.actualRating}&#9733;</p>
                    ) : (
                      <p>Not Rated</p>
                    )}
                  </div>
                  <img className={styles.cardImage} src={val.data.pUrl} />
                  <p>{val.data.pName}</p>
                  <p>&#x20B9;{val.data.pPrice}</p>
                </div>
              </Link>
            ))
          : null}
      </div>
    </>
  );
};

export default DashBoard;
