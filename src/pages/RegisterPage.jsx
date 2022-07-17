import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../stylesheets/authentication.css";
import fireDB from "../fireConfig";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const register = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result);
      Cookies.set("Token", result.user.accessToken);
      Cookies.set("id", result.user.uid);
      const messageRef = doc(fireDB, "cart", result.user.uid);
      await setDoc(messageRef, {
        cartItems: [],
      });
      const userRef = doc(fireDB, "users", result.user.uid);
      await setDoc(userRef, {
        email: result.user.email,
      });
      console.log("cart", messageRef);
      setLoading(false);
      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Registration fail");
    }
  };
  return (
    <div className="container">
      {loading && <Loader />}
      <div className="d-flex align-items-center justify-content-center mt-5">
        <div className="col-lg-3 col-xl-3 col-md-6 col-sm-3 mt-5">
          <div className="m-5 text-center">
            <h2 className="text-center mb-3">Register</h2>
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
            <input
              type="password"
              className="form-control mb-3"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            />
            <button
              type="button"
              class="btn place-order-btn w-100 my-3"
              onClick={register}
            >
              Register
            </button>
          </form>

          <hr />
          <span>Have an account?</span>
          <Link to="/login">Click here to login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
