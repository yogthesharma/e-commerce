import * as firebase from "firebase";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
var firebaseConfig = {
  apiKey: publicRuntimeConfig.FIRE_KEY,
  authDomain: "react-crud-5c0db.firebaseapp.com",
  databaseURL: "https://react-crud-5c0db.firebaseio.com",
  projectId: "react-crud-5c0db",
  storageBucket: "react-crud-5c0db.appspot.com",
  messagingSenderId: "603581859615",
  appId: "1:603581859615:web:45725de0903856facc122a",
};

export default firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);
