import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, addDoc, getDocs } from "firebase/firestore";
import fireDB from "../fireConfig";
import Layout from "../components/Layout";
import "../stylesheets/cart.css";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
function CartPage() {
  const { cartItems } = useSelector((state) => state.cartReducer);
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

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + cartItem.price;
    });
    setTotalAmount(temp);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const deleteFromCart = (product) => {
    dispatch({ type: "DELETE_FROM_CART", payload: product });
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
      <div className="cart-wrapper">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              return (
                <tr>
                  <td>
                    <img src={item.imageURL} alt="" height="80" width="80" />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <div className="d-flex">
                      <button className="qty-btn">
                        <span>-</span>
                      </button>
                      <p>1</p>
                      <button className="qty-btn">
                        <span>+</span>
                      </button>
                    </div>
                  </td>
                  <td>{item.price}</td>
                  <td>
                    <FaTrash onClick={() => deleteFromCart(item)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <>
          <div className="d-flex justify-content-end">
            <h1 className="total-amount">Total Amount = $ {totalAmount}</h1>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button onClick={handleShow}>Place Order</button>
          </div>
        </>

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
      </div>
    </Layout>
  );
}

export default CartPage;
