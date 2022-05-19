import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function Header() {
  return (
    <div className="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/">
            Ecommerce
          </Link>
          <button
            class="navbar-toggler"
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
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/">
                  user
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  orders
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Logout
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  cart
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
