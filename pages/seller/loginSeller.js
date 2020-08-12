import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/Forms.module.css";
import Fire from "../../components/firebase";

const LoginSeller = () => {
  const initVals = {
    email: "",
    password: "",
  };

  const [values, setValues] = useState(initVals);
  const router = useRouter();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await Axios.post("http://localhost:3000/api/sellerAuth", values, {
      headers: { purpose: "loginUser" },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.status)
          return Fire.auth()
            .signInWithEmailAndPassword(values.email, values.password)
            .then((res) => {
              alert("User Logged In");
              return router.push("/seller");
            });
        alert("Wrong Credentials Entered");
        // router.push("/seller");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <div className={styles.loginseller}>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={changeHandler}
          />
          <br />
          <Form.Label>Password:</Form.Label>
          <Form.Control
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={changeHandler}
          />
          <br />
          <Button type="submit">Login</Button>
          <br />
          <Link href="/seller/sellerLogin">
            <a>Register Instead</a>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default LoginSeller;
