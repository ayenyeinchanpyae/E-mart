import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import fireDB from "../fireConfig";
import Layout from "../components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { async } from "@firebase/util";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    categoryprice: 0,
    imageURL: "",
    category: "",
  });
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const editHandler = (item) => {
    setProduct(item);
    setShow(true);
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      await setDoc(doc(fireDB, "products", product.id), product);

      handleClose();
      toast.success("updated successfully");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("update fail");
    }
  };

  const addHandler = () => {
    setAdd(true);
    handleShow();
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      await addDoc(collection(fireDB, "products"), product);

      handleClose();
      toast.success("added successfully");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("add fail");
    }
  };

  const deleteProduct = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "products", item.id));
      setLoading(false);
      toast.success("product deleted successfully");
      getData();
    } catch (error) {
      toast.error("product delete fail");
      setLoading(false);
    }
  };
  return (
    <Layout loading={loading}>
      <div className="d-flex justify-content-between">
        <h3>Products List</h3>
        <button onClick={addHandler}>ADD PRODUCT</button>
      </div>
      <table className="table mt-2">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr>
                <td>
                  <img src={item.imageURL} alt="" height="80" width="80" />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>
                  <FaTrash onClick={() => deleteProduct(item)} />
                  <FaEdit onClick={() => editHandler(item)} size={20} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{add ? "Add a product" : "Edit Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control m-3"
            placeholder="name"
            value={product.name}
            onChange={(e) => {
              setProduct({ ...product, name: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="imageURL"
            value={product.imageURL}
            onChange={(e) => {
              setProduct({ ...product, imageURL: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="price"
            value={product.price}
            onChange={(e) => {
              setProduct({ ...product, price: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="category"
            value={product.category}
            onChange={(e) => {
              setProduct({ ...product, category: e.target.value });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {add ? (
            <Button variant="primary" onClick={addProduct}>
              Save
            </Button>
          ) : (
            <Button variant="primary" onClick={updateProduct}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminPage;
