import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      users.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
      });
      setProducts(productsArray);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <h1>Homepage</h1>
    </Layout>
  );
}

export default HomePage;
