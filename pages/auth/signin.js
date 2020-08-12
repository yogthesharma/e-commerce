import { Card, Button, Form } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Axios from "axios";
import Fire from "../../components/firebase";

// import Toasts from "../Components.js/Toasts";
import styles from "../../styles/Forms.module.css";

const Signup = () => {
  const initVals = {
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  };

  const [values, setValues] = useState(initVals);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await Fire.auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(async (user) => {
        await Fire.firestore().collection("e-commerce-user").add({
          email: values.email,
          phone: values.phone,
        });
        router.push("/dashboard");
      })
      .catch((e) => console.log(e));

    // await Axios.post("http://localhost:3000/api/userAuth", values, {
    //   headers: {
    //     purpose: "register",
    //   },
    // })
    //   .then((res) => {
    //     setSuccess(res.data);
    //     return router.push("/dashboard");
    //   })
    //   .catch((e) => {
    //     setError(e.response.data);
    //   });
  };

  return (
    <div style={{ height: "80vh" }}>
      {/* {error ? <Toasts msg={error.msg} type="error" /> : null}
      {success ? <Toasts msg="User Logging In" type="error" /> : null} */}

      <Card className={styles.signinUser}>
        <Card.Header>Register Here</Card.Header>
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
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              inputMode="number"
              type="number"
              name="phone"
              value={values.phone}
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
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              inputMode="text"
              type="text"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            <br />
            <Button className="w-100" variant="secondary" type="submit">
              Register
            </Button>
            <br />
            <Link href="/auth/login">
              <a>Login Instead</a>
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
