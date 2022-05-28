import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filter, setFiler] = useState("");
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

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="d-flex w-50">
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
        </div>
        <div className="row">
          {products
            .filter((obj) => obj.name.toLowerCase().includes(searchKey))
            .filter((obj) => obj.category.toLowerCase().includes(filter))
            .map((product) => {
              return (
                <div className="col-md-4">
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
                      <h3>$ - {product.price}</h3>
                      <div className="d-flex">
                        <button
                          className="mx-2"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/productinfo/${product.id}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
