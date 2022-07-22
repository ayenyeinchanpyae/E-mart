import { useEffect, useState } from "react";
import fireDB from "../fireConfig";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../stylesheets/productInfo.css";
function ProductInfo() {
  const params = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uid = Cookies.get("id");
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const productTemp = await getDoc(
        doc(fireDB, "products", params.productid)
      );

      setProduct(productTemp.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const addToCart = async (product) => {
    if (uid) {
      console.log(uid);
      const itemArray = [];
      const querySnapshot = await getDocs(
        collection(fireDB, "cart", uid, "items")
      );
      querySnapshot.forEach((doc) => {
        itemArray.push(doc.data());
      });

      const productExist = itemArray.find((item) => item.id === product.id);

      if (productExist) {
        console.log("product exist");
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
      <div className="container ">
        <div className="row align-items-center justify-content-center m-lg-5">
          {product && (
            <div className="product-wrapper d-flex flex-column flex-lg-row flex-xl-row flex-md-column flex-sm-column">
              <div className="image-wrapper">
                <img
                  src={product.imageURL}
                  alt=""
                  className="img"
                  height="300"
                  width="250"
                />
              </div>
              <div className="product-info">
                <p>
                  <b>{product.name}</b>
                </p>
                <p>{product.description}</p>
                <div className="d-flex justify-content-between my-3">
                  <button
                    className="place-order-btn w-25 bg-light text-black-50"
                    onClick={() => {
                      navigate("/products");
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="place-order-btn w-50"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProductInfo;
