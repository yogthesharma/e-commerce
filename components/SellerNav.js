import React from "react";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";

const SellerNav = () => {
  return (
    <div>
      <Row className="mb-5" style={{ backgroundColor: "grey", height: "3rem" }}>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link href="/seller">
            <a style={{ color: "white" }}>Add Item</a>
          </Link>
        </Col>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link href="/seller/sellerItems">
            <a style={{ color: "white" }}>Listed Items</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default SellerNav;
