import { useState } from "react";
import { ProductsType } from "./AdminProducts";
import axios from "axios";

type ProductEditType = {
  selectedProduct: ProductsType | null;
  closeModal: () => void;
};

const ProductEditForm = ({ selectedProduct, closeModal }: ProductEditType) => {
  const [productName, setProductName] = useState<string | undefined>(
    selectedProduct?.name
  );

  const [imageUrl, setImageUrl] = useState<string | undefined>(
    selectedProduct?.image_link
  );
  const [description, setDescription] = useState<string | undefined>(
    selectedProduct?.description
  );
  const [quantity, setQuantity] = useState<number | undefined>(
    selectedProduct?.quantity
  );

  const [price, setPrice] = useState<number | undefined>(
    selectedProduct?.price
  );
  const [type_name, setType_Name] = useState<string | undefined>(
    selectedProduct?.type_name
  );
  const [error, setError] = useState<string>("");
  const updateProducts = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/${selectedProduct?.id}`,
        {
          name: productName,
          type_name: type_name,
          image_link: imageUrl,
          description: description,
          quantity: quantity,
          price: price,
        }
      );
      if (response.data.statistics) {
        console.log(response.data.statistics);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !productName ||
      !type_name ||
      !price ||
      !imageUrl ||
      !description ||
      !quantity
    ) {
      setError("Fields cannot be empty");
      return;
    }
    console.log("Form submitting...");
    await updateProducts();
    closeModal();
  };
  return (
    <div className="mt-1">
      <h2 className="2xl:text-2xl xl:text-xl font-bold mb-4">Edit User</h2>
      {selectedProduct && (
        <form
          className="flex flex-col 2xl:gap-4 xl:gap-2"
          onSubmit={handleSubmit}
        >
          <label htmlFor="product_name" className="font-semibold">
            Product Name
            <input
              type="text"
              defaultValue={selectedProduct.name}
              onChange={(e) => {
                setProductName(e.target.value);
                setError("");
              }}
              id="product_name"
              className="border font-normal w-full border-black focus:border-blue-500 px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="image_link" className="font-semibold">
            Image Url
            <input
              type="text"
              defaultValue={selectedProduct.image_link}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setError("");
              }}
              id="image_link"
              className="border w-full font-normal border-black focus:border-blue-500 px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="description" className="font-semibold">
            Description
            <input
              type="text"
              defaultValue={selectedProduct.description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              id="description"
              className="border w-full font-normal border-black focus:border-blue-500  px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="quantity" className="font-semibold">
            Quantity
            <input
              type="number"
              defaultValue={selectedProduct.quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value));
                setError("");
              }}
              id="quantity"
              className="border w-full font-normal border-black focus:border-blue-500  px-3 py-2 rounded block mt-1"
            />
          </label>
          <label htmlFor="price" className="font-semibold">
            Price
            <input
              type="number"
              defaultValue={selectedProduct.price}
              onChange={(e) => {
                setPrice(parseInt(e.target.value));
                setError("");
              }}
              id="price"
              className="border w-full font-normal border-black focus:border-blue-500  px-3 py-2 rounded block mt-1"
            />
          </label>

          {/* Type Dropdown */}
          <label htmlFor="type_name" className="font-semibold">
            Type
            <select
              defaultValue={selectedProduct?.type_name}
              onChange={(e) => {
                setType_Name(e.target.value);
                setError("");
              }}
              id="type_name"
              className="border w-full font-normal border-black focus:border-blue-500  bg-white px-3 py-2 rounded block mt-1"
            >
              <option value="Beer">Beer</option>
              <option value="Whiskey">Whiskey</option>
              <option value="Wine">Wine</option>
              <option value="Rum">Rum</option>
              <option value="Tequila">Tequila</option>
              <option value="Vodka">Vodka</option>
            </select>
          </label>
          {error && <h1 className="text-sm text-red-500">{error}</h1>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-slate-300 rounded hover:bg-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditForm;
