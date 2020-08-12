import Fire from "../../components/firebase";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      if (!req.body.pUrl)
        return res.json({ msg: "Image Url Not Attached", errFlag: true });
      const data = await Fire.firestore()
        .collection("e-commerce-data")
        .add(req.body);
      res.json({ msg: "Data Saved", body: req.body, id: data.id });
    } catch (error) {
      res.status(500).json({
        msg: "Some Internal Error Occured",
        errFlag: true,
      });
    }
  }
  if (req.method === "GET") {
    try {
      await Fire.firestore()
        .collection("e-commerce-data")
        .get()
        .then((snapshot) => {
          res.json({ data: snapshot.docs });
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Some Internal Error Occured", errFlag: true });
    }
  }
};
