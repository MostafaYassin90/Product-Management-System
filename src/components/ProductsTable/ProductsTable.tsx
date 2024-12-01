"use client";
import { Product } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type TProps = {
  products: Product[],
  forDelete: {
    runForDelete: boolean,
    setRunForDelete: Dispatch<SetStateAction<boolean>>
  }
}

function ProductsTable(props: TProps) {
  const { products } = props;
  const { runForDelete, setRunForDelete } = props.forDelete;

  const router = useRouter();

  // Delete Product Handler
  const deleteProductHandler = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/api/products/${id}`)
    setRunForDelete((prev) => !prev)
  }

  const showProducts = products.length > 0 ?
    products.map((product, index) => (
      <tr key={product.id}>
        <td>{index + 1}</td>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.taxes}</td>
        <td>{product.ads}</td>
        <td>{product.discount}</td>
        <td>{product.subTotal}</td>
        <td>{product.count}</td>
        <td>{product.subTotal * product.count}</td>
        <td>{product.category}</td>
        <td>
          <Link href={`/productManagement?productId=${product.id}`} className="btn btn-primary py-1 px-2">Update</Link>
        </td>
        <td>
          <button className="btn btn-danger py-1 px-2" onClick={() => {
            deleteProductHandler(product.id)
          }}>Delete</button>
        </td>
      </tr>
    ))
    :
    (<tr>
      <td colSpan={12}>Empty!</td>
    </tr>)
  return (
    <>
      {/* Tabel */}
      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Taxes</th>
            <th>Ads</th>
            <th>Discount</th>
            <th>SubTotal Per Unit</th>
            <th>Count</th>
            <th>SubTotal</th>
            <th>Category</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {showProducts}
        </tbody>
      </table>
      {/* Tabel */}
    </>
  )
}
export default ProductsTable;