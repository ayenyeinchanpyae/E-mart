import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "../stylesheets/authentication.css";
import Loader from "../components/Loader";
import Cookies from "js-cookie";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      Cookies.set("Token", userCredential.user.accessToken);
      Cookies.set("id", userCredential.user.uid);
      navigate("/");
    } catch (error) {
      toast.error("Wrong User Credential");
    }
  };

  return (
    <div className="container w-100 h-auto">
      {loading && <Loader />}

      <div className="d-flex align-items-center justify-content-center m-5">
        <div className="col-lg-3 col-xl-3 col-md-6 col-sm-3 mt-5">
          <div className="m-5 text-center">
            <h2 className="text-center mb-3">Welcome back!</h2>
          </div>
          <form action="">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {/* <button className="auth-btns m-3 w-75">LOGIN</button> */}
            <button
              type="button"
              class="btn place-order-btn w-100 my-3"
              onClick={login}
            >
              Login
            </button>
          </form>

          <hr />
          <span>Not a member yet? </span>
          <Link to="/register">Click here to register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
