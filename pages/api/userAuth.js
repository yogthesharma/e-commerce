import Fire from "../../components/firebase";
// test
const admin = require("firebase-admin");
import runMiddleware from "../../components/init-middleware";
import Cors from "cors";

// this is middleware
const cors = Cors({
  methods: [GET, POST],
});

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  if (req.method === "POST") {
    if (req.headers.purpose === "login") {
      const { email, password } = req.body;
      console.log(email, password);
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: "Fill All The Fields Carefully", errFlag: true });
      await Fire.auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) =>
          res.json({ msg: "Logging In User", user, errFlag: false })
        )
        .catch((e) => res.status(400).json({ msg: e.message }));
    } else if (req.headers.purpose === "register") {
      const { email, phone, password, confirmPassword } = req.body;
      if (!email || !password || !phone || !confirmPassword)
        return res
          .status(400)
          .json({ msg: "Fill All The Fields Carefully", errFlag: true });

      if (password !== confirmPassword)
        return res.status(400).json({
          msg: "Password Not Confirmed",
          errFlag: true,
        });

      await Fire.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (user) => {
          await Fire.firestore().collection("e-commerce-user").add({
            email,
            phone,
          });
          res.json({
            msg: "Account Created! Logging User In ",
            errFlag: true,
          });
        })
        .catch((e) => res.status(400).json({ msg: e.message }));
    }
    if (req.headers.purpose === "addAddress") {
      const { address, district, email, city, state, orderId } = req.body;
      console.log(req.body);
      if (!address || !district || !email || !city || !state || !orderId)
        return res
          .status(400)
          .json({ msg: "Please Enter Address", errFlag: true });
      const id = await Fire.firestore()
        .collection("e-commerce-user")
        .where("email", "==", email)
        .get();

      id.forEach(
        async (data) =>
          await Fire.firestore()
            .collection("e-commerce-user")
            .doc(data.id)
            .update({ address, district, city, state, orderId })
      );
      id.forEach(async (data) => {
        const user = await Fire.firestore()
          .collection("e-commerce-user")
          .doc(data.id)
          .get();
        console.log(user.data());
        res.json({ msg: "Done", errFlag: false, user: user.data() });
      });
    }
    if (req.headers.purpose === "addCartItems") {
      const { userInfo, itemInfo } = req.body;
      console.log(userInfo, itemInfo);
      const washingtonRef = Fire.firestore()
        .collection("e-commerce-user")
        .doc(userInfo);

      console.log(itemInfo);

      // Atomically add a new region to the "regions" array field.
      await washingtonRef.update({
        cartItems: admin.firestore.FieldValue.arrayUnion("itemInfo"),
      });
    }

    // sending item with total information
    if (req.headers.purpose === "itemInfo") {
      const { itemId } = req.body;
      const id = String(itemId);
      console.log(itemId);
      console.log(id);
      const itemRef = await Fire.firestore()
        .collection("e-commerce-data")
        .doc(itemId);
      const doc = await itemRef.get();
      if (!doc.exists) {
        console.log("No such document!");
        res.json({ msg: "No such document!" });
      } else {
        console.log("Document data:", doc.data());
        res.json({ msg: doc.data() });
      }

      // res.json({ item: "item.data()" });
    }
    if (req.headers.purpose === "userInfo") {
      const { email } = req.body;
      console.log(email);
      const snapshot = await Fire.firestore()
        .collection("e-commerce-user")
        .where("email", "==", email)
        .get();
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("No matching documents.");
        res.json({ msg: "No Matching Request Found" });
        return;
      }
      snapshot.forEach((doc) => {
        return res.json({
          uoInfo: doc.data(),
          uid: doc.id,
        });
      });
      console.log("Passed");
      // res.json({ user: user.providerData,uid: });
    }
  }
  if (req.method === "GET") {
    if (req.headers.purpose === "checkLogin") {
      await Fire.auth().onAuthStateChanged((user) => {
        if (user) {
          return res.json({
            errFlag: false,
          });
        } else {
          res.json({ errFlag: true });
        }
      });
    }
    if (req.headers.purpose === "signOut") {
      await Fire.auth().signOut();
      res.json({ msg: "User Logged Out" });
    }
  }
};
