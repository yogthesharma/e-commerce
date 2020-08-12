import Fire from "../../components/firebase";
const firebase = require("firebase/app");
import runMiddleware from "../../components/init-middleware";
import Cors from "cors";

// this is middleware
const cors = Cors({
  methods: [GET, POST],
});

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    if (req.headers.purpose === "registerSeller") {
      let {
        vName,
        vAddress,
        city,
        state,
        phoneCode,
        phoneNumber,
        bName,
        zip,
        email,
        password,
        confirmPassword,
        description,
      } = req.body;

      if (
        !vName ||
        !vAddress ||
        !city ||
        !state ||
        !phoneCode ||
        !phoneNumber ||
        !bName ||
        !zip ||
        !email ||
        !password ||
        !confirmPassword ||
        !description
      )
        return res
          .status(400)
          .json({ msg: "Fill All the fields carefully", errFlag: true });

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ msg: "Password Do Not Match", errFlag: true });
      }
      const phone = "+" + phoneCode + phoneNumber;
      console.log(phone);

      const adder = await Fire.firestore()
        .collection("e-commerce-seller")
        .add({
          vName,
          vAddress,
          city,
          state,
          phone,
          bName,
          zip,
          email,
          description,
        })
        .catch((e) =>
          res.status(400).json({ msg: "Some Error Occured", status: false })
        );

      if (!adder)
        return res.status(400).json({
          status: false,
          msg:
            "No Be Able To Create New User At The Moment !!! Try Again Later",
          errFlag: true,
        });

      res.json({ status: true, msg: "User Logged In" });
    } else if (req.headers.purpose === "loginUser") {
      const { email } = req.body;
      console.log(email);
      const seller = await Fire.firestore()
        .collection("e-commerce-seller")
        .where("email", "==", email)
        .get()
        .catch((e) =>
          res.status(400).json({ msg: "Some Error Occured", errFlag: true, e })
        );
      seller.forEach((snap) => {
        return res.json({ status: true, errFlag: false });
      });

      res.json({ status: false, errFlag: true });
    } else if (req.headers.purpose === "deleteItem") {
      const user = await Fire.auth().currentUser;
      const email = user.email;
      const seller = await Fire.firestore()
        .collection("e-commerce-seller")
        .where("email", "==", email)
        .get();

      const idArr = [];
      seller.forEach((res) => idArr.push(res.id));

      const { id } = req.body;
      console.log(idArr[0]);
      console.log(id);

      if (!id) {
        return res
          .status(400)
          .json({ msg: "Unable To Delete Item At The Moment" });
      }
      const refer = await Fire.firestore()
        .collection("e-commerce-seller")
        .doc(idArr[0]);

      const remove = await refer
        .update({
          listedItems: firebase.firestore.FieldValue.arrayRemove(id),
        })
        .catch((e) =>
          res.status(400).json({ msg: "Unable To Delete Item", errFlag: true })
        );

      const removeItem = await Fire.firestore()
        .collection("e-commerce-data")
        .doc(id)
        .delete()
        .catch((e) =>
          res.status(400).json({ msg: "Unable To Delete Item", errFlag: true })
        );

      console.log(removeItem);
      return res.json({ msg: "Item Successfully Removed", errFlag: false });
    } else if (req.headers.purpose === "updateItem") {
      try {
        console.log(req.body);
        const {
          id,
          pName,
          pFeatures,
          pColors,
          discountPrice,
          pPrice,
          keywords,
          stock,
        } = req.body;
        const colors = pColors.split(",");
        const features = pFeatures.split(",");
        const keys = keywords.split(",");
        console.log(id);
        const itemRef = await Fire.firestore()
          .collection("e-commerce-data")
          .doc(id)
          .update({
            pName,
            pFeatures: features,
            pColors: colors,
            discountPrice,
            pPrice,
            keywords: keys,
            stock,
          })
          .catch((e) =>
            res.status(500).json({
              msg: "Some Error Occured In Processing",
              errFlag: true,
              e,
            })
          );

        res.json({ msg: "Done Updating", errFlag: false });
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", errFlag: true });
      }
    } else if (req.headers.purpose === "sellerList") {
      const user = await Fire.auth().currentUser;
      const { email } = req.body;
      const snapshot = await Fire.firestore()
        .collection("e-commerce-seller")
        .where("email", "==", email)
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return res
          .status(400)
          .json({ msg: "No matching documents.", errFLag: true });
      }
      snapshot.forEach((doc) => {
        return res.json({
          uoInfo: doc.data().listedItems,
          uid: doc.id,
        });
      });
      console.log("Passed");
      // res.json({ user: user.providerData,uid: });
    } else if (req.headers.purpose === "sellerInfo") {
      const { email } = req.body;
      console.log(email);
      const snapshot = await Fire.firestore()
        .collection("e-commerce-seller")
        .where("email", "==", email)
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return res
          .status(400)
          .json({ msg: "No matching documents.", errFLag: true });
      }
      snapshot.forEach((doc) => {
        return res.json({
          uoInfo: doc.data(),
          uid: doc.id,
          errFlag: false,
        });
      });
      console.log("Passed");
      // res.json({ user: user.providerData,uid: });
    }
  } else if (req.method === "GET") {
  }
};
