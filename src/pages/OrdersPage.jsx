import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import fireDB from "../fireConfig";
import Cookies from "js-cookie";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const uid = Cookies.get("id");

  useEffect(() => {
    getEmail();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getEmail = async () => {
    const userRef = doc(fireDB, "users", uid);
    const docSnap = await getDoc(userRef);
    const email = docSnap.data().email;

    setEmail(email);
  };

  async function getData() {
    try {
      //setLoading(true);
      const result = await getDocs(collection(fireDB, "orders"));
      console.log(result);
      const resultArray = [];
      const ordersArray = [];
      result.forEach((doc) => {
        resultArray.push(doc.data());
        // setLoading(false);
      });
      console.log("resultArray", resultArray);
      for (var i = 0; i < resultArray.length; i++) {
        console.log("uid", uid);
        console.log("result id", resultArray[i].userid);
        if (resultArray[i].userid === uid) {
          console.log(resultArray[i]);
          ordersArray.push(resultArray[i]);
        } else {
          console.log("no order yet");
        }
      }
      console.log("order array", ordersArray);
      setOrders(ordersArray);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <Layout loading={loading}>
      <div className="d-flex align-items-center justify-content-center">
        <h3>{email.substring(0, email.length - 10)}'s order</h3>
      </div>
      {orders.map((order) => {
        return (
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-8">
                <div className="table-responsive">
                  <table className="table mt-5 order">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.cartItems.map((item) => {
                        return (
                          <tr>
                            <td>
                              <img
                                src={item.imageURL}
                                alt=""
                                height="80"
                                width="80"
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Layout>
  );
}

export default OrdersPage;
