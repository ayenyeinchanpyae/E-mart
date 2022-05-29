import { Link } from "react-router-dom";
import { FaBars, FaCartPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
function Header() {
  const { cartItems } = useSelector((state) => state.cartReducer);
  const token = Cookies.get("Token");

  const logout = () => {
    Cookies.remove("Token");
    window.location.reload();
  };
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
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
                <p className="nav-link active" aria-current="page" to="/">
                  {token ? (
                    "user name"
                  ) : (
                    <Link className="nav-link" to="/">
                      Login
                    </Link>
                  )}
                  {/* {user.email.substring(0, user.email.length - 10)} */}
                </p>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  orders
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={logout}>
                  Logout
                </Link>
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
