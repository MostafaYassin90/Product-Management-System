"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import ProductsTable from "@/components/ProductsTable/ProductsTable";
import { Product } from "@prisma/client";
import { schema } from "@/utils/vaSchema";
import { useSearchParams } from "next/navigation";
import "./ProductManagement.css";


function ProductManagement() {
  const searchParams = useSearchParams();
  let productId = searchParams.get("productId");

  // Router
  const router = useRouter();
  // State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string | number>("");
  const [taxes, setTaxes] = useState<string | number>("");
  const [ads, setAds] = useState<string | number>("");
  const [discount, setDiscount] = useState<string | number>("");
  const [subTotal, setSubtotal] = useState(0);
  const [count, setCount] = useState<string | number>("");
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [runGetProducts, setRunGetProducts] = useState(false);
  const [runForDelete, setRunForDelete] = useState(false);

  // Function Get Single Product
  const getSingleProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      const data: Product = response.data;
      setTitle(data.title);
      setPrice(data.price);
      setTaxes(data.taxes);
      setAds(data.ads);
      setDiscount(data.discount);
      setCount(data.count);
      setCategory(data.category);
      // router.replace(`/productManagement?productId=${productId}`)
    } catch (error) {
      if (isAxiosError(error)) {
        return toast.error("An UnExpected Error.")
      }
    }
  }
  useEffect(() => {
    if (productId) {
      getSingleProduct()
    }
  }, [productId])

  // Handle SubTotal
  const subtotalHandler = async () => {
    let taxesPlusAds = +taxes + +ads; // costs 
    let pricePlusCosts = +price + +taxesPlusAds;
    let subTotal = +pricePlusCosts - +discount;
    setSubtotal(subTotal);
  };
  // Function To Get All Products
  const GetAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      const data: Product[] = await response.data;
      const filteringByTitle = data.filter((product) => {
        if (searchText === "") {
          return product;
        } else {
          return product.title.toLowerCase().includes(searchText.toLowerCase())
        }
      })
      setProducts(filteringByTitle);
      console.log(filteringByTitle)
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    GetAllProducts()
  }, [runGetProducts, searchText, runForDelete])

  useEffect(() => {
    subtotalHandler()
  }, [price, taxes, ads, discount])


  // OnSubmit Handler
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = {
      title: title,
      price: +price,
      taxes: taxes === "" ? 0 : +taxes,
      ads: ads === "" ? 0 : +ads,
      discount: discount === "" ? 0 : +discount,
      subTotal: subTotal,
      count: +count,
      category: category
    };
    const validation = schema.safeParse(product);
    if (!validation.success) {
      return toast.error(validation.error.errors[0].message)
    };
    try {
      let response = null;
      if (!productId) {
        response = await axios.post("http://localhost:3000/api/products", product);
        console.log("POST")
        setRunGetProducts((prev) => !prev);
      } else {
        response = await axios.put(`http://localhost:3000/api/products/${productId}`, product);
        console.log("PUt")
        setRunGetProducts((prev) => !prev);
      }
      router.push("/productManagement");
      if (response.status === 201 || response.status === 200) {
        setTitle("")
        setPrice("")
        setTaxes("")
        setAds("")
        setDiscount("")
        setSubtotal(0)
        setCount("")
        setCategory("")
      }
    } catch (error) {
      if (isAxiosError(error)) {
        return toast.error(error.response?.data.message || error.message)
      } else {
        return toast.error("An UnExpexted Error")
      }
    }
  }

  return (
    <div className="productManagement">
      <ToastContainer position="top-center" autoClose={5000} pauseOnFocusLoss theme="colored" />
      <div className="container">
        {/* Form */}
        <form onSubmit={onSubmitHandler}>
          <input type="text" placeholder="Title" name="title" value={title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value)
            }} />
          <div className="holder-price">
            <input type="number" placeholder="Price" name="price" value={price}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPrice(event.target.value)
              }} />
            <input type="number" placeholder="Taxes" name="taxes" value={taxes}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTaxes(event.target.value)
              }} />
            <input type="number" placeholder="Ads" name="ads" value={ads}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAds(event.target.value)
              }}
            />
            <input type="number" placeholder="discount" name="discount" value={discount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDiscount(event.target.value)
              }}
            />
            <div className="subtotal">
              <span className="text">SubTotal:</span>
              <span className="num">{subTotal}</span>
            </div>
          </div>
          <input type="number" placeholder="Count" name="count" value={count}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCount(event.target.value)
            }} />
          <input type="text" placeholder="Category" name="category" value={category}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCategory(event.target.value)
            }}
          />
          <button className="create-btn">{productId ? "Update" : "Create"}</button>
        </form>
        {/* Form */}
        {/* Search */}
        <div className="search-holder">
          <input type="text" placeholder="Search" name="search" value={searchText}
            onChange={((event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchText(event.target.value)
            })}
          />
        </div>
        {/* Search */}
        {/* Tabel */}
        <ProductsTable products={products} forDelete={{ runForDelete, setRunForDelete }} />
        {/* Tabel */}
      </div>
    </div>
  )
}
export default ProductManagement;