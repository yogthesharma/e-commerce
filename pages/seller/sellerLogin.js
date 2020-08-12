import { useState } from "react";
import { Form, Button, Jumbotron, Container, Row, Col } from "react-bootstrap";
import Axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Fire from "../../components/firebase";
import styles from "../../styles/Forms.module.css";

const Seller = () => {
  const router = useRouter();

  const initVals = {
    vName: "",
    vAddress: "",
    city: "",
    state: "",
    phoneCode: "",
    phoneNumber: "",
    bName: "",
    zip: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  };

  const [values, setValues] = useState(initVals);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Axios.post("http://localhost:3000/api/sellerAuth", values, {
      headers: { purpose: "registerSeller" },
    }).then((res) => {
      if (!res.data.status) alert("Unable to register user.");
      Fire.auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .catch((e) => console.log(e));
      router.push("/seller");
    });
  };

  return (
    <div>
      <Jumbotron fluid>
        <Container>
          <h1>Seller's Login</h1>
        </Container>
      </Jumbotron>
      <div className={styles.sellerRegistration}>
        <div id="recaptcha-container"></div>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Vendor Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Vendor's Name"
            name="vName"
            value={values.vName}
            onChange={handleChange}
          />
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Address"
            name="vAddress"
            value={values.vAddress}
            onChange={handleChange}
          />
          <Row>
            <Col>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={values.city}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                name="state"
                value={values.state}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Form.Label>Phone Number</Form.Label>
          <Row>
            <Col xs={4} md={3}>
              <Form.Control
                placeholder="+91"
                type="number"
                name="phoneCode"
                value={values.phoneCode}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Form.Label>Business Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name Of Business"
            name="bName"
            value={values.bName}
            onChange={handleChange}
          />

          <Row>
            <Col md={5}>
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="000000"
                name="zip"
                value={values.zip}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="example@example.com"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="text"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Form.Label>Describe Business</Form.Label>
          <Form.Control
            type="text"
            placeholder="Describe Your Business"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
          <br />
          <Button variant="secondary" type="submit">
            Register
          </Button>
          <br />
          <Link href="/seller/loginSeller">
            <a>Login Instead</a>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Seller;
