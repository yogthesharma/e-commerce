import Fire from "../../components/firebase";
import firebase from "firebase/app";
import runMiddleware from "../../components/init-middleware";
import Cors from "cors";

// this is middleware
const cors = Cors({
  methods: [GET, POST],
});

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    if (req.headers.purpose === "addRating") {
      try {
        const { rating, review, email, id } = req.body;

        if (!rating && !review) {
          res.status(400).json({
            msg: "You have to enter at least one entry.",
            errFlag: true,
          });
        }

        const item = await Fire.firestore()
          .collection("e-commerce-data")
          .doc(id)
          .get();

        if (item.data().rating !== undefined) {
          console.log("Here1");
          const rates = await item.data().rating;
          const length = rates.length;
          console.log("Here");
          const emailCheck = rates.find((item) => item.email === email);
          if (emailCheck) {
            console.log("If Block");
            const index = rates.findIndex((x) => x.email === email);
            console.log(id);
            const ref = await Fire.firestore()
              .collection("e-commerce-data")
              .doc(id);
            await ref
              .update({
                rating: firebase.firestore.FieldValue.arrayRemove(rates[index]),
              })
              .then(async (ress) => {
                await Fire.firestore()
                  .collection("e-commerce-data")
                  .doc(id)
                  .update({
                    rating: firebase.firestore.FieldValue.arrayUnion({
                      review,
                      rating,
                      email,
                    }),
                  });
              })
              .catch((e) => console.log(e));
          } else {
            console.log("Last Black");

            await Fire.firestore()
              .collection("e-commerce-data")
              .doc(id)
              .update({
                rating: firebase.firestore.FieldValue.arrayUnion({
                  review,
                  rating,
                  email,
                }),
              })
              .then((ress) =>
                res.json({
                  msg: "Thank You For Your Feedback!!!",
                  errFlag: false,
                })
              )
              .catch((e) =>
                res
                  .status(500)
                  .json({ msg: "Internal server error", errFlag: true })
              );
          }
        } else {
          console.log("SOne");
          const item = await Fire.firestore()
            .collection("e-commerce-data")
            .doc(id)
            .get();
          if (item.data().actualRating === undefined) {
            Fire.firestore().collection("e-commerce-data").doc(id).update({
              rating,
            });
          } else {
            const rate = await item.data().actualRating;
            const actualRating =
              (await (Number(rate) + Number(rating))) / length;
            await Fire.firestore()
              .collection("e-commerce-data")
              .doc(id)
              .update({
                actualRating,
              });
          }
          await Fire.firestore()
            .collection("e-commerce-data")
            .doc(id)
            .update({
              rating: firebase.firestore.FieldValue.arrayUnion({
                review,
                rating,
                email,
              }),
            })
            .then((ress) =>
              res.json({
                msg: "Thank You For Your Feedback!!!",
                errFlag: false,
              })
            )
            .catch((e) =>
              res
                .status(500)
                .json({ msg: "Internal server error", errFlag: true })
            );
        }

        const itm = await Fire.firestore()
          .collection("e-commerce-data")
          .doc(id)
          .get();

        const dat = itm.data().rating;

        const length = dat.length;
        const secondArr = dat.map((val) => Number(val.rating));
        const sum = secondArr.reduce((acc, val) => acc + val);
        const actualRating = sum / length;
        await Fire.firestore().collection("e-commerce-data").doc(id).update({
          actualRating,
        });
      } catch (error) {
        res
          .status(500)
          .json({ msg: "Internal Server Error", error, errFlag: true });
      }
    } else if (req.headers.purpose === "prevReview") {
      try {
        const { email, id } = req.body;
        console.log(email);
        const item = await Fire.firestore()
          .collection("e-commerce-data")
          .doc(id)
          .get();
        console.log(item.data().rating);
        if (item.data().rating !== undefined) {
          const userItem = await item
            .data()
            .rating.find((item) => item.email === email);
          if (userItem.email !== email) {
            console.log("found false");
            return res.json({ found: false });
          }
          res.json({ found: true, userItem });
        } else {
          return res.json({ found: false });
        }
      } catch (error) {
        res
          .status(500)
          .json({ msg: "Internal Server Errors", error, errFlag: true });
      }
    }
  } else if (req.method === "GET") {
  }
};
