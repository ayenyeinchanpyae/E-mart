import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";

function Layout(props) {
  return (
    <div>
      <Header />
      {props.loading && <Loader />}
      <div className="content">{props.children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
