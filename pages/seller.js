import React, { useEffect } from "react";
import { Jumbotron, Container, Button } from "react-bootstrap";
import SellingForm from "../components/sellingForm";
import SellerNav from "../components/SellerNav";

const seller = () => {
  return (
    <div>
      <Jumbotron fluid>
        <Container>
          <h1>Seller Portal</h1>
          <p>
            This is admin's page in which he or she may add new items to sell on
            the site.
          </p>
        </Container>
      </Jumbotron>
      <SellerNav />
      <div className="row">
        <div className="col"></div>
        <div className="col-sm-11 col-md-6">
          <SellingForm />
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

export default seller;
