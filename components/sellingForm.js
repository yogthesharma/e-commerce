import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Fire from "./firebase";
import Axios from "axios";
import firebase from "firebase/app";
// importing styling
import styles from "../styles/Forms.module.css";

const SellingForm = () => {
  const initValues = {
    pName: "",
    pFeatures: [],
    pPrice: "",
    pColors: [],
    pUrl: "",
    price: "",
    discountPrice: "",
    stock: "",
    keywords: [],
    seller: null,
  };
  const [values, setValues] = useState(initValues);
  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [seller, setSeller] = useState();
  const [sid, setSid] = useState();
  const [itemId, setItemId] = useState();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "text") {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Fire.storage().ref(`e-image/${image.name}`).put(image);
    await Fire.storage()
      .ref(`e-image`)
      .child(image.name)
      .getDownloadURL()
      .then((res) => setImgUrl(res));

    setValues({ ...values, seller });

    if (imgUrl) {
      if (typeof values.pFeatures === "string")
        values.pFeatures = values.pFeatures.split(",");
      if (typeof values.pColors === "string")
        values.pColors = values.pColors.split(",");
      if (typeof values.keywords === "string")
        values.keywords = values.keywords.split(",");
      setItemId("");
      values.pUrl = imgUrl;
      await Axios.post("http://localhost:3000/api/data", values).then(
        async (res) => {
          console.log(res.data.id);
          // const user = await Fire.firestore()
          //   .collection("e-commerce-seller")
          //   .where("email", "==", seller)
          //   .get();

          const id = sid;
          await Fire.firestore()
            .collection("e-commerce-seller")
            .doc(id)
            .update({
              listedItems: firebase.firestore.FieldValue.arrayUnion(
                res.data.id
              ),
            })
            .then((res) => alert("Item Uploaded"))
            .catch((e) => alert("Some Error Occured In Uploading Item"));
        }
      );
    }
  };

  const resetFields = () => {
    setValues(initValues);
  };

  useEffect(() => {
    const fetchUser = async () => {
      await Fire.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const email = user.email;
          await setSeller(email);
          console.log(email);
          await Axios.post(
            "http://localhost:3000/api/sellerAuth",
            { email },
            {
              headers: { purpose: "loginUser" },
            }
          );

          await Axios.post(
            "http://localhost:3000/api/sellerAuth",
            {
              email,
            },
            { headers: { purpose: "sellerInfo" } }
          )
            .then((res) => {
              console.log(res.data);
              setSid(res.data.uid);
              return setSeller(res.data.uoInfo);
            })
            .catch((e) => {
              if (
                confirm("You have to login with seller account to continue.")
              ) {
                router.push("/seller/loginSeller");
              } else {
                router.push("/dashboard");
              }
            });
        } else {
          router.push("/seller/loginSeller");
        }
      });
    };
    fetchUser();
  }, []);

  return (
    <div style={{ paddingBottom: "3rem" }}>
      <Form
        onSubmit={handleSubmit}
        style={{ marginBottom: "10rem" }}
        className={styles.form}
      >
        <h2>Add New Product To Database Here</h2>
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
        <Form.Label>Product's Image</Form.Label>
        <Form.Control
          type="file"
          placeholder="Upload The Most Relevent Image Of The Product"
          name="pUrl"
          onChange={handleImage}
        />
        <br />
        <Button variant="secondary" type="submit">
          Upload Item
        </Button>{" "}
        <Button variant="secondary" onClick={resetFields}>
          Reset Fields
        </Button>
      </Form>
    </div>
  );
};

export default SellingForm;
