import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import ProductInfo from "./pages/ProductInfo";
import Product from "./pages/Product";

import "./stylesheets/layout.css";
import "./stylesheets/products.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";
import OrdersPage from "./pages/OrdersPage";
function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/productinfo/:productid"
            element={
              <ProtectedRoutes>
                <ProductInfo />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoutes>
                <CartPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <OrdersPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes>
                <AdminPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/products" element={<Product />} />
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

export const ProtectedRoutes = ({ children }) => {
  if (Cookies.get("Token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
