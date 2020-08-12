import React, { useState } from "react";
import Loader from "react-loader-spinner";
const Loaders = (prop) => {
  const [temp, setTemp] = useState(prop.condition);

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100vh",
        backgroundColor: "black",
        top: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "99",
      }}
    >
      <Loader
        type="ThreeDots"
        color="white"
        height={100}
        width={100}
        //3 secs
      />
    </div>
  );
};

export default Loaders;
