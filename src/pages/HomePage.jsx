import { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import fireDB from "../fireConfig";
import Layout from "../components/Layout";
import { FaCartPlus, FaEye } from "react-icons/fa";

import hero from "../images/hero.png";
function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uid = Cookies.get("id");
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
      const array = productsArray.slice(-4);
      setProducts(array);
      console.log(products);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  const addToCart = async (product) => {
    if (uid) {
      const itemArray = [];
      const querySnapshot = await getDocs(
        collection(fireDB, "cart", uid, "items")
      );
      querySnapshot.forEach((doc) => {
        itemArray.push(doc.data());
      });

      const productExist = itemArray.find((item) => item.id === product.id);

      if (productExist) {
        const itemRef = doc(fireDB, "cart", uid, "items", product.id);

        try {
          await updateDoc(itemRef, {
            quantity: productExist.quantity + 1,
            price: productExist.price,
          });
          toast.success("Successfully added to cart");
        } catch (error) {
          console.log(error);
          toast.error("Error occurred.Please try again");
        }
      } else {
        const messageRef = doc(fireDB, "cart", uid, "items", product.id);
        try {
          await setDoc(messageRef, {
            id: product.id,
            name: product.name,
            price: product.price,
            imageURL: product.imageURL,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
          });
          toast.success("Successfully added to cart");
        } catch (error) {
          console.log(error);
          toast.error("Error occurred.Please try again");
        }
      }
    } else {
      toast.error("Please login first to buy");
      navigate("/login");
    }
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row ">
          <div className="mt-5 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <h3 className="m-3">Welcome from our store</h3>
            <p className="m-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
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
            <div style={{ width: "500px" }}>
              <img className="" src={hero} alt="" width="100%" height="auto" />
            </div>
          </div>
        </div>
        {/* popular items */}
        <div className="col-lg-12 mt-5">
          <h3>Popular Items</h3>
        </div>
        {loading ? (
          <div style={{ height: "300px" }} />
        ) : (
          <div className="row m-1 mt-5">
            <div className="container">
              <div className="row">
                {products.map((product) => {
                  return (
                    <div className="col-md-6 col-lg-3" key={product.id}>
                      <div className="m-2 p-1 product position-relative">
                        <div className="product-content ">
                          <div className="text-center">
                            <img
                              src={product.imageURL}
                              alt=""
                              className="product-img m-2"
                            />
                          </div>
                          <p className="m-2">{product.name}</p>
                        </div>
                        <div className="product-actions">
                          <div className="d-flex flex-column">
                            <h3>$ - {product.price}</h3>
                            <div className="d-flex justify-content-between mt-3">
                              <div>
                                <FaCartPlus
                                  className="cart-btn fs-5"
                                  onClick={() => addToCart(product)}
                                />
                              </div>
                              <div>
                                <FaEye
                                // onClick={() => {
                                //   navigate(`/productinfo/${product.id}`);
                                // }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
