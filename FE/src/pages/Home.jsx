import { useEffect } from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const Home = () => {
  useEffect(() => {
    document.title = "Child Growth Tracking - Home";
  }, []);
  return (

    <div className="flex flex-col min-h-screen">
      <Header />

      home page
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>


      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
