import Fire from "../../components/firebase";
const firebase = require("firebase/app");
const nodemailer = require(`nodemailer`);
import runMiddleware from "../../components/init-middleware";
import Cors from "cors";

// this is middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    if (req.headers.purpose === "savingNumberOfItems") {
      try {
        await Fire.firestore()
          .collection("item-number")
          .add(req.body)
          .then((resu) => res.json({ msg: "Success", errFlag: false }))
          .catch((e) =>
            res
              .status(500)
              .json({ msg: "Internal Server Error", errFlag: true, e })
          );
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", errFlag: true });
      }
    } else if (req.headers.purpose === "getSelItem") {
      try {
        console.log("Done");
        const { userEmail } = req.body;
        console.log(userEmail);
        const userItem = await Fire.firestore()
          .collection("item-number")
          .where("userEmail", "==", userEmail)
          .get();
        console.log("Done");
        userItem.forEach((val) => {
          Fire.firestore()
            .collection("item-number")
            .doc(val.id)
            .get()
            .then((ress) => res.json({ data: ress.data() }))
            .catch((e) =>
              res
                .status(400)
                .json({ msg: "Internal Server Error", errFlag: true })
            );
        });
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", errFlag: true });
      }
    } else if (req.headers.purpose === "deletingItems") {
      try {
        console.log("Done");
        const { userEmail } = req.body;
        console.log(userEmail);
        const userItem = await Fire.firestore()
          .collection("item-number")
          .where("userEmail", "==", userEmail)
          .get();

        userItem.forEach((val) =>
          Fire.firestore().collection("item-number").doc(val.id).delete()
        );
        res.json({ msg: "Done", errFlag: false });
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", errFlag: true });
      }
    } else if (req.headers.purpose === "placeOrder") {
      try {
        const { email, itemId, unit, date, tPrice } = req.body;
        console.log(email);
        console.log(itemId);
        const itemData = await Fire.firestore()
          .collection("e-commerce-data")
          .doc(itemId)
          .get();
        const stocks = Number(itemData.data().stock);
        const units = Number(unit);
        const result = stocks - units;
        const user = await Fire.firestore()
          .collection("e-commerce-user")
          .where("email", "==", email)
          .get();
        user.forEach((ids) =>
          Fire.firestore()
            .collection("e-commerce-user")
            .doc(ids.id)
            .update({
              orders: firebase.firestore.FieldValue.arrayUnion({
                itemId,
                unit,
                date,
                tPrice,
              }),
            })
            .then(async (ress) => {
              await Fire.firestore()
                .collection("e-commerce-data")
                .doc(itemId)
                .update({
                  stock: String(result),
                });

              res.json({
                msg: "OrderP Placed",
                errFlag: false,
              });
            })
            .catch((e) =>
              res
                .status(500)
                .json({ msg: "Internal Server Error", errFlag: true })
            )
        );
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", errFlag: true });
      }
    }
  }
  if (req.method === "GET") {
    console.log("Nothing Till Now");
  }
};
