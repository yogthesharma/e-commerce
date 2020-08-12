import Fire from "../../components/firebase";
import runMiddleware from "../../components/init-middleware";
import Cors from "cors";

// this is middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

export default async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    if (req.headers.purpose === "searchItems") {
      try {
        const arr = [];
        const { search } = req.body;
        const actualKeys = search.split(" ");
        actualKeys.map(async (val) => {
          await Fire.firestore()
            .collection("e-commerce-data")
            .where("keywords", "array-contains", val)
            .get()
            .then((snapshot) => {
              snapshot.forEach((snap) => {
                console.log(snap.id);
                arr.push({ id: snap.id, data: snap.data(), errFlag: false });
              });
            })
            .catch((error) =>
              res
                .status(500)
                .json({ msg: "Internal Server Error", errFlag: true, error })
            );

          if (arr.length >= 1) {
            res.json({
              msg: "Done",
              arr,
              errFlag: false,
            });
          } else {
            return res.json({
              msg: "No Such Item In the Database",
              errFlag: true,
            });
          }
        });
      } catch (error) {
        res
          .status(500)
          .json({ msg: "Internal Server Error", errFlag: true, error });
      }
    }
  }
};
