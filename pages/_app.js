import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../components/NavBar";

function MyApp({ Component, pageProps }) {
  return (
    // <ItemContext>
    <div>
      <NavBar />
      <Component {...pageProps} />
    </div>
    // </ItemContext>
  );
}

export default MyApp;
