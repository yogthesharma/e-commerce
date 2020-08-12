import React, { useEffect } from "react";
import MainSection from "../components/Index/mainSection";
import Fire from "../components/firebase";
import Axios from "axios";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  console.log(router);
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
            return;
          });
      }
    });
  };
  useEffect(() => {
    if (router.pathname === "/") {
      SellerAccountDetection();
    }
  }, []);

  return (
    <div>
      <MainSection />
    </div>
  );
};

export default index;
