import { Link } from "react-router-dom";
import { FaBars, FaCartPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { doc, collection, getDocs, getDoc } from "firebase/firestore";
import fireDB from "../fireConfig";

function Header() {
  const token = Cookies.get("Token");
  const uid = Cookies.get("id");
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState("");
  const [cartNumber, setCartNumber] = useState();

  const getEmail = async () => {
    const userRef = doc(fireDB, "users", uid);
    const docSnap = await getDoc(userRef);
    const email = docSnap.data().email;
    setEmail(email);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    getEmail();
  }, []);

  const logout = () => {
    Cookies.remove("Token");
    Cookies.remove("id");
    window.location.reload();
  };

  const getCartItems = async () => {
    try {
      const itemArray = [];
      const querySnapshot = await getDocs(
        collection(fireDB, "cart", uid, "items")
      );
      querySnapshot.forEach((doc) => {
        itemArray.push(doc.data());
      });
      const length = itemArray.length;
      setCartItems(itemArray);
      setCartNumber(length);
    } catch (error) {
      console.log(error);
    }
    // const userRef = doc(fireDB, "users", uid);
    // const docSnap = getDoc(userRef);

    // console.log("Document data:", userRef);
    // try {
    //   const itemArray  = [];
    //   const querySnapshot = await getDocs(
    //     collection(fireDB, "cart", uid, "items")
    //   );
    //   querySnapshot.forEach((doc) => {
    //     itemArray.push(doc.data());
    //   });
    //   setCartItems(itemArray);
    // } catch (error) {}
    // //setCartItems[itemArray.length];
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand ms-5" to="/">
            Ecommerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span>
              <FaBars size={25} color="white" />
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/products"
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                {token ? (
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/orders"
                  >
                    {email.substring(0, email.length - 10)}
                  </Link>
                ) : (
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </li>

              <li className="nav-item">
                {token ? (
                  <Link className="nav-link" to="/" onClick={logout}>
                    Logout
                  </Link>
                ) : (
                  ""
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  <FaCartPlus /> {cartItems.length}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
