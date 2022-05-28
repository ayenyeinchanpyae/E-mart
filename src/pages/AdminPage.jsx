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
import "../stylesheets/admin.css";
import { toast } from "react-toastify";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [productname, setProductname] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [catg, setCatg] = useState("");
  const [desc, setDesc] = useState("");
  const [product, setProduct] = useState({
    name: "",
    price: 0,
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
    setAdd(false);
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
      <div className="wrapper">
        <div className="d-flex justify-content-between">
          <h3>Products List</h3>
          <button onClick={addHandler} className="add-product-btn">
            ADD PRODUCT
          </button>
        </div>
        <table className="table mt-3">
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
                <tr key={item}>
                  <td>
                    <img src={item.imageURL} alt="" height="80" width="80" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.price}</td>
                  <td>
                    <div className="action-btns">
                      <FaTrash onClick={() => deleteProduct(item)} />
                      <FaEdit onClick={() => editHandler(item)} size={20} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{add ? "Add a product" : "Edit Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control m-3"
            placeholder="name"
            value={add ? productname : product.name}
            onChange={(e) => {
              setProductname(e.target.value);
              setProduct({ ...product, name: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="imageURL"
            value={add ? url : product.imageURL}
            onChange={(e) => {
              setUrl(e.target.value);
              setProduct({ ...product, imageURL: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="price"
            value={add ? price : product.price}
            onChange={(e) => {
              setPrice(e.target.value);
              setProduct({ ...product, price: e.target.value });
            }}
          />
          <input
            type="text"
            className="form-control m-3"
            placeholder="category"
            value={add ? catg : product.category}
            onChange={(e) => {
              setCatg(e.target.value);
              setProduct({ ...product, category: e.target.value });
            }}
          />
          <textarea
            type="text"
            className="form-control m-3"
            placeholder="description"
            value={add ? desc : product.description}
            onChange={(e) => {
              setDesc(e.target.value);
              setProduct({ ...product, category: e.target.value });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={handleClose}>
            Cancel
          </Button>
          {add ? (
            <Button className="modal-btn" onClick={addProduct}>
              Save
            </Button>
          ) : (
            <Button className="modal-btn" onClick={updateProduct}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminPage;
