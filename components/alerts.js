import React, { useState } from "react";
import { Alert } from "react-bootstrap";

const Alerts = (prop) => {
  return (
    <div>
      <Alert variant={prop.variant}>{prop.error}</Alert>
    </div>
  );
};

export default Alerts;
