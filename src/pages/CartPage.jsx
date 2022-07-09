import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, addDoc, getDocs } from "firebase/firestore";
import fireDB from "../fireConfig";
import Layout from "../components/Layout";
import "../stylesheets/cart.css";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinCode, setPinCode] = useState("");

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const uid = Cookies.get("id");
  const discount = 0;
  const tax = 15;
  const deliveryFee = 20;

  useEffect(() => {
    getCartItems();
  }, []);
  useEffect(() => {
    totalPrice();
  }, []);
  const deleteFromCart = (product) => {
    dispatch({ type: "DELETE_FROM_CART", payload: product });
  };
  const totalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total = total + item.price;
    });
    setTotalAmount(total);
  };
  const getCartItems = async () => {
    try {
      const itemArray = [];
      const querySnapshot = await getDocs(
        collection(fireDB, "cart", uid, "items")
      );
      querySnapshot.forEach((doc) => {
        itemArray.push(doc.data());
      });
      setCartItems(itemArray);
    } catch (error) {
      console.log(error);
    }
    //setCartItems[itemArray.length];
  };

  const placeOrder = async () => {
    const info = {
      name,
      address,
      phoneNumber,
      pinCode,
    };
    const orderInfo = {
      cartItems,
      info,
      email: JSON.parse(localStorage.getItem("currentUser")).user.email,
      userid: JSON.parse(localStorage.getItem("currentUser")).user.uid,
    };

    try {
      setLoading(true);
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      setLoading(false);
      toast.success("Order Placed successfully");
      localStorage.removeItem("cartItems");
      handleClose();
    } catch (error) {
      setLoading(false);
      toast.error("Order fail");
    }
  };
  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            {/* {cartItems.map((item) => {
              return (
                <div className="d-flex mb-3">
                  <div>
                    <img
                      src={item.imageURL}
                      className="me-2"
                      alt=""
                      height="80"
                      width="80"
                    />
                  </div>
                  <div className="me-2">
                    <p>{item.name}</p>
                  </div>
                  <div className="me-2">
                    <p>{item.category}</p>
                  </div>
                  <div className="me-2">
                    <p>{item.quantity}</p>
                  </div>
                  <div className="me-2">
                    <p>${item.price}</p>
                  </div>
                  <div>
                    <div className="action-btn">
                      <FaTrash onClick={() => deleteFromCart(item)} />
                    </div>
                  </div>
                </div>
              );
            })} */}
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
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
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                        <td>
                          <div className="action-btn">
                            <FaTrash onClick={() => deleteFromCart(item)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex  align-items-center justify-content-center col-sm-12 col-xs-12 col-md-12 col-lg-6 ">
            <div className="d-flex flex-column w-50">
              <h4 className="text-center">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Items Price</span>
                <span>{totalAmount}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Discount</span>
                <span>{discount}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>{tax}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>{deliveryFee}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total</span>
                <span>$ - {discount + totalAmount + tax + deliveryFee}</span>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button className="place-order-btn w-100" onClick={handleShow}>
                  CheckOut
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control m-3"
            placeholder="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="phone number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />

          <textarea
            type="text"
            className="form-control m-3"
            placeholder="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          <input
            type="number"
            className="form-control m-3"
            placeholder="pin code"
            value={pinCode}
            onChange={(e) => {
              setPinCode(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={placeOrder}>
            ORDER
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default CartPage;
