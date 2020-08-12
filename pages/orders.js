import { useState, useEffect } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import Fire from "../components/firebase";

const Orders = () => {
  const [userInfo, setUserInfo] = useState();
  const [email, setEmail] = useState();
  const [itemInfo, setItemInfo] = useState([]);
  const [id, setId] = useState();
  const [temp, setTemp] = useState(false);
  const [values, setValues] = useState({
    range: 0,
    review: "",
  });
  const router = useRouter();

  const redirectRouter = (id) => {
    router.push(`/itemdynamic/[itemId]`, `/itemdynamic/${id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const removeRating = () => {
    const rating = document.querySelectorAll(".rating");
    rating[0].style.visibility = "hidden";
  };

  const rating = async (id) => {
    setValues({ range: 0, review: "" });
    await setId(id);
    console.log(id);
    console.log(email);
    await Axios.post(
      "http://localhost:3000/api/rating",
      {
        email,
        id,
      },
      { headers: { purpose: "prevReview" } }
    )
      .then(async (res) => {
        if (res.data.found) {
          console.log("Done If Stmt");
          return setValues({
            ...values,
            range: res.data.userItem.rating,
            review: res.data.userItem.review,
          });
        } else {
          await setTemp((condition) => !condition);
          console.log("Done, Not If Stmt");
        }
        // make it work
      })
      .catch((e) => console.log(e.response.data));

    const rating = document.querySelectorAll(".rating");
    const ratingBtn = document.querySelectorAll(".ratingBtn");
    console.log(temp);
    if (temp) {
      ratingBtn[0].innerHTML = "Update Post";
    }
    rating[0].style.visibility = "visible";
  };

  const handleSubmit = async (e) => {
    await Axios.post(
      "http://localhost:3000/api/rating",
      {
        rating: values.range,
        review: values.review,
        email,
        id,
      },
      { headers: { purpose: "addRating" } }
    )
      .then((res) => console.log(res.data.msg))
      .catch((e) => console.log(e.response.data));
  };

  useEffect(() => {
    setItemInfo([]);
    const userFetch = async () => {
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const email = user.email;
          setEmail(email);
          await Axios.post(
            "http://localhost:3000/api/userAuth",
            { email },
            {
              headers: { purpose: "userInfo" },
            }
          ).then((res) => {
            if (res.data.uoInfo === undefined) {
              return router.push("/dashboard");
            }
            setUserInfo(res.data.uoInfo.orders);
            if (res.data.uoInfo.orders === undefined) {
              alert("No Items In The Ordered List");
              return router.push("/dashboard");
            }
            res.data.uoInfo.orders.map(async (val) => {
              await Axios.post(
                "http://localhost:3000/api/userAuth",
                { itemId: val.itemId },
                { headers: { purpose: "itemInfo" } }
              )
                .then((res) => {
                  setItemInfo((items) => [
                    ...items,
                    {
                      data: res.data,
                      tPrice: val.tPrice,
                      unit: val.unit,
                      date: val.date,
                      itemId: val.itemId,
                    },
                  ]);
                })
                .catch((e) => console.log(e.response.data));
            });
          });
        } else {
          console.log("No User Found");
          router.push("/auth/login");
        }
      });
    };

    userFetch();
    console.log(itemInfo);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: "2rem auto",
      }}
    >
      <div
        className="rating"
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "column",
          border: "1px solid black",
          backgroundColor: "white",
          borderRadius: "10px",
          visibility: "hidden",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <div
          onClick={removeRating}
          style={{ cursor: "pointer" }}
          className="d-flex w-100 justify-content-end p-5"
        >
          &#x2715;
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "1rem",
            margin: "1rem",
            width: "25rem",
            height: "25rem",
          }}
        >
          <div className="d-flex w-100 flex-column align-items-center justify-content-end">
            {values.range}&#9733;
            <Form.Control
              type="range"
              min="1"
              max="5"
              name="range"
              value={values.range}
              onChange={handleChange}
            />
          </div>
          <Form.Control
            style={{
              border: "unset",
              borderBottom: "1px solid black",
              borderRadius: "0",
            }}
            placeholder="Also Write Here"
            type="text"
            name="review"
            value={values.review}
            onChange={handleChange}
          />
          <div className="d-flex w-100 align-items-center justify-content-end">
            <Button className="ratingBtn" onClick={handleSubmit}>
              Post
            </Button>
          </div>
        </div>
      </div>
      {itemInfo && userInfo
        ? itemInfo.map((item) => (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
                width: "20rem",
                height: "27rem",
                flexWrap: "wrap",
                border: "2px solid black",
                padding: "1rem",
                margin: "1rem",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                  padding: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => redirectRouter(item.itemId)}
              >
                <img style={{ width: "70%" }} src={item.data.msg.pUrl} />
                <h5>{item.data.msg.pName}</h5>
                <p>Bought In: {item.tPrice}</p>
                <p>Units Bought: {item.unit}</p>
                <br />
                <h7>{item.date}</h7>
              </div>
              <a
                onClick={() => rating(item.itemId)}
                style={{ cursor: "pointer", color: "green" }}
              >
                Rate Item
              </a>
            </div>
          ))
        : null}
    </div>
  );
};

export default Orders;

// start

// &#9734;
// &#9733;
