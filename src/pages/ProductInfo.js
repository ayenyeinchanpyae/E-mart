import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import fireDB from "../fireConfig";

import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

function ProductInfo() {
  const params = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const productTemp = await getDoc(
        doc(fireDB, "products", params.productid)
      );

      setProduct(productTemp.data());
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Layout>
      <div className="container m-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {product && (
              <div className="d-flex">
                <img
                  src={product.imageURL}
                  alt=""
                  className="product-info-img"
                />
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
