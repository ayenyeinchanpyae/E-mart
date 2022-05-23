import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";

function ProductCard({ id, imageURL, name, price }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems } = useSelector((state) => state.cartReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      users.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
        setLoading(false);
      });
      setProducts(productsArray);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  //   const addToCart = (product) => {
  //     dispatch({ type: "ADD_TO_CART", payload: product });
  //   };
  return (
    <div className="col-md-4">
      <div className="m-2 p-1 product position-relative">
        <div className="product-content">
          <div className="text-center">
            <img src={imageURL} alt="" className="product-img" />
          </div>
          <p>{name}</p>
        </div>
        <div className="product-actions">
          <h3>$ - {price}</h3>
          <div className="d-flex">
            <button className="mx-2">
              {/* onClick={() => addToCart(product)} */}
              Add to Cart
            </button>
            <button
              onClick={() => {
                navigate(`/productinfo/${id}`);
              }}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
