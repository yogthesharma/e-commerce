import { useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import Fire from "../../components/firebase";
import styles from "../../styles/Forms.module.css";
// import Toasts from "../Components.js/Toasts";

const Login = () => {
  const router = useRouter();

  const initVals = {
    email: "",
    password: "",
  };

  const [values, setValues] = useState(initVals);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // checking for the values for the mail of use or seller
    await Axios.post(
      "http://localhost:3000/api/userAuth",
      { email: values.email },
      { headers: { purpose: "userInfo" } }
    ).then(async (res) => {
      if (res.data.uid) {
        await Fire.auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then((res) => {
            router.back();
          })
          .catch((e) => {
            setError(e.response.data);
            setLoading(false);
          });

        await Fire.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in.
            console.log(user);
            setLoading(false);
          } else {
            // No user is signed in.
            console.log("No User");
          }
        });
      } else {
        alert("Wrong Credentials");
      }
    });
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
    if (router.pathname === "/auth/login" && router.pathname !== "/seller") {
      SellerAccountDetection();
    }
  }, []);

  return (
    <div style={{ height: "80vh" }}>
      {loading ? <Loaders condition={loading} /> : null}

      <Card className={styles.loginUser}>
        <Card.Header>Login Here</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              inputMode="text"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            <Form.Label>Password:</Form.Label>
            <Form.Control
              inputMode="text"
              type="text"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <br />
            <Button className="w-100" variant="secondary" type="submit">
              Login
            </Button>
            <br />
            <Link href="/auth/signin">
              <a>Signup Instead</a>
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
