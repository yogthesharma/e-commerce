import Fire from "../../components/firebase";
const firebase = require("firebase/app");
const nodemailer = require(`nodemailer`);

export default async (req, res) => {
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

              // nodemailer config

              const output = `
          <h3>Order Placed</h3>
          <p>Order ID :${itemId}</p>
          <p>Order Date :${date}</p>
          <p>Price : ${tPrice}
          `;
              // create reusable transporter object using the default SMTP transport
              let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                // secure: false, // true for 465, false for other ports
                auth: {
                  user: `yogthesharma@gmail.com`, // generated ethereal user
                  pass: `00000000@Akk`, // generated ethereal password
                },
              });
              console.log(email, "sending");
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: "yogthesharma@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: output, // html body
              });

              console.log("Message sent: %s", info.messageId);
              console.log("Message sent: %s", another.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

              // Preview only available when sending through an Ethereal account
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(another)
              );
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
