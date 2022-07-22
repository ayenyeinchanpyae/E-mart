import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
    const docRef = doc(fireDB, "cart", uid, "items", product.id);

    try {
      setLoading(true);
      deleteDoc(docRef)
        .then(() => {
          setLoading(false);
          toast.success("deleted successfly from cart");
          getCartItems();
          totalPrice();
        })
        .catch((error) => {
          toast.error("something went wrong,please try again");
          console.log(error);
        });
    } catch (error) {}
  };

  const totalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total = total + item.price;
      console.log(total);
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
    clearCart();
    getCartItems();
    const info = {
      name,
      address,
      phoneNumber,
      pinCode,
    };
    const orderInfo = {
      cartItems,
      info,
      userid: uid,
    };

    try {
      setLoading(true);
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      clearCart();
      setLoading(false);
      toast.success("Order Placed successfully");

      handleClose();
    } catch (error) {
      setLoading(false);
      toast.error("Order fail");
    }
  };

  const clearCart = () => {
    for (var i = 0; i < cartItems.length; i++) {
      const docRef = doc(fireDB, "cart", uid, "items", cartItems[i].id);
      try {
        setLoading(true);
        deleteDoc(docRef)
          .then(() => {
            setLoading(false);
            getCartItems();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {}
    }
  };
  return (
    <Layout loading={loading}>
      <div className="container">
        {cartItems.length > 0 ? (
          <div className="row">
            <div className="col-lg-6">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>

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
                  <button
                    className="place-order-btn w-100"
                    onClick={handleShow}
                  >
                    CheckOut
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h3 className="row align-items-center justify-content-center">
            You don't have any item in your cart
          </h3>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center flex-column">
            <input
              type="text"
              className="form-control m-3 w-75"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control m-3 w-75"
              placeholder="phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />

            <textarea
              type="text"
              className="form-control m-3 w-75"
              placeholder="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <input
              type="number"
              className="form-control m-3 w-75"
              placeholder="pin code"
              value={pinCode}
              onChange={(e) => {
                setPinCode(e.target.value);
              }}
            />
          </div>
          <div className="d-flex gap-5 justify-content-end w-100 m-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <button className="place-order-btn w-25 me-5" onClick={placeOrder}>
              ORDER
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default CartPage;
