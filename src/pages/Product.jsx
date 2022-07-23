import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";
import Cookies from "js-cookie";
import { FaCartPlus, FaEye } from "react-icons/fa";

function Product() {
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
      setProducts(productsArray);
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
          getData();
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
          getData();
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
        {/* <div className="d-flex w-50">
          <input
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            type="text"
            className="form-control"
            placeholder="search items"
          />
          <select
            className="form-control"
            value={filter}
            onChange={(e) => {
              setFiler(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="beauty">Beauty</option>
          </select>
        </div> */}
        {loading ? (
          <div style={{ height: "100vh" }} />
        ) : (
          <div className="row">
            {products
              // .filter((obj) => obj.name.toLowerCase().includes(searchKey))
              // .filter((obj) => obj.category.toLowerCase().includes(filter))
              .map((product) => {
                return (
                  <div className="col-md-6 col-lg-3" key={product.id}>
                    <div className="m-2 p-1 product position-relative">
                      <div className="product-content">
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
        )}
      </div>
    </Layout>
  );
}

export default Product;
