import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import fireDB from "../fireConfig";

import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import "../stylesheets/productInfo.css";
function ProductInfo() {
  const params = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);

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
  return (
    <Layout loading={loading}>
      <div className="container m-5">
        <div className="row justify-content-center">
          <div className="col-md-8 product-info">
            {product && (
              <div className="d-flex m-5">
                <div className="product-info-img">
                  <img
                    src={product.imageURL}
                    alt=""
                    className=""
                    height="400"
                  />
                </div>
                <div className="info  ms-5">
                  <p>
                    <b>{product.name}</b>
                  </p>
                  <p>{product.description}</p>
                  <div className="d-flex justify-content-end my-3">
                    <button>Add to Cart</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductInfo;
