import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../stylesheets/authentication.css";
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const register = async () => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result);
      setLoading(false);
      toast.success("Registration successful");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Registration fail");
    }
  };
  return (
    <div className="register-parent">
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
            <div className="m-2">
              <h2 className="text-center">Register</h2>

              <input
                type="text"
                className="form-control m-2"
                placeholder="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                className="form-control m-2"
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="password"
                className="form-control m-2"
                placeholder="confirm password"
                value={cpassword}
                onChange={(e) => {
                  setCpassword(e.target.value);
                }}
              />
              <button onClick={register}>REGISTER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
