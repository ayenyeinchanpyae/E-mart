import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import hero from "../images/hero.png";
function HomePage() {
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchKey, setSearchKey] = useState("");
  // const [filter, setFiler] = useState("");
  // const { cartItems } = useSelector((state) => state.cartReducer);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   getData();
  // }, []);

  // async function getData() {
  //   try {
  //     setLoading(true);
  //     const users = await getDocs(collection(fireDB, "products"));
  //     const productsArray = [];
  //     users.forEach((doc) => {
  //       const obj = {
  //         id: doc.id,
  //         ...doc.data(),
  //       };
  //       productsArray.push(obj);
  //       setLoading(false);
  //     });
  //     setProducts(productsArray);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }
  // useEffect(() => {
  //   localStorage.setItem("cartItems", JSON.stringify(cartItems));
  // }, [cartItems]);

  // const addToCart = (product) => {
  //   dispatch({ type: "ADD_TO_CART", payload: product });
  // };
  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row ">
          <div className="mt-5 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <h3 className="m-3">Welcome from grace store</h3>
            <p className="m-3">
              pLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <Link to="/products">
              <button className="shop-now-btn ms-3 mt-3">Shop Now</button>
            </Link>
          </div>
          <div className="d-flex align-items-center justify-content-center col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div>
              <img className="" src={hero} alt="" width="500px" height="auto" />
            </div>
          </div>
        </div>
        <div className="row m-1 mt-5">
          <div className="col-lg-12"></div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
