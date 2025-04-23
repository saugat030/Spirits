import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Modal from "react-modal";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ProductEditForm from "./ProductEditForm";
import { FaCirclePlus } from "react-icons/fa6";

export type ProductsType = {
  id: number;
  name: string;
  image_link: string;
  description: string;
  quantity: number;
  type_id: number;
  type_name: string;
  price: number;
};

Modal.setAppElement("#root");
const AdminProducts = () => {
  const [products, setProducts] = useState<ProductsType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsType | null>(
    null
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(true);
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?page=${page}`
      );
      if (response.data.statistics && response.data.statistics.length > 0) {
        setProducts(response.data.statistics);
        setHasMore(true);
      } else {
        setPage((prev) => prev - 1);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh, page]);

  const openModal = (product: ProductsType) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setRefresh(!refresh);
  };

  const handleDelete = async (id: number) => {
    console.log("Delete product:", id);
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProducts((prev) => prev?.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <ClipLoader color="brown" size={100} />
      </div>
    );
  } else {
    return (
      <div className="p-10 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-700">Products</h2>
          <button className="flex gap-2 items-center bg-slate-100 text-slate-700 border px-4 py-2 rounded-2xl shadow-md hover:bg-slate-600 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out font-semibold tracking-wide">
            <FaCirclePlus />
            Add Product
          </button>
        </div>
        <div className="pb-2 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 text-slate-600 text-left text-sm uppercase font-medium">
              <tr>
                {[
                  "Product Id",
                  "Product Name",
                  "Type",
                  "Image Url",
                  "Description",
                  "Price",
                  "Quantity",
                  "Action",
                ].map((item) => (
                  <th key={item} className="p-4">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="even:bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.type_name}</td>
                  <td className="p-4 max-w-52 text-nowrap text-ellipsis overflow-hidden">
                    {product.image_link}
                  </td>
                  <td className="p-4">{product.description}</td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openModal(product)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded bg-slate-200 text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-slate-600 font-medium">{page}</span>
            <button
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded bg-slate-200 text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Edit Product"
            className="bg-white p-4 max-w-md mx-auto 2xl:mt-20 border-2 border-green-500 rounded shadow-md outline-none font-Poppins"
            overlayClassName="fixed z-50 inset-0 bg-black bg-opacity-30"
          >
            <ProductEditForm
              closeModal={closeModal}
              selectedProduct={selectedProduct}
            />
          </Modal>
        </div>
      </div>
    );
  }
};

export default AdminProducts;
