import React, { useState } from "react";
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

  const login = async () => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("result", result);
      Cookies.set("Token", result.user.accessToken);
      window.location.href = "/";
      setLoading(false);
      toast.success("Login successful");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Login fail");
    }
  };

  return (
    <div className="register-parent mt-5">
      {loading && <Loader />}
      <div className="d-flex align-items-center m-5">
        <div className="image  col-md-6">
          <lottie-player
            src="https://assets7.lottiefiles.com/packages/lf20_5tkzkblw.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="form-wrapper col-md-4">
          <div className="register-form">
            <div className="m-5 text-center">
              <h2 className="text-center mb-5">Login</h2>

              <input
                type="text"
                className="form-control m-3"
                placeholder="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                className="form-control m-3"
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <button className="auth-btns m-3" onClick={login}>
                LOGIN
              </button>
              {/* <hr />
              <Link to="/register">Click here to register</Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
