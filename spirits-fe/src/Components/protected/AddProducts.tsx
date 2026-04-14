import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddProducts = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const [price, setPrice] = useState<number>(0);
  const [type_name, setType_Name] = useState<string>("");
  const [error, setError] = useState<string>("");

  const addProduct = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(`http://localhost:3000/api/products`, {
        name: productName,
        type_name: type_name,
        image_link: imageUrl,
        description: description,
        quantity: quantity,
        price: price,
      });
      if (response.data.statistics) {
        console.log(response.data.statistics);
        navigate("/admin/products");
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
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
    await addProduct();
  };

  return (
    <div className="flex justify-center gap-40 h-[calc(100vh-60px)] items-center">
      <form
        className="flex flex-col 2xl:gap-4 xl:gap-2"
        onSubmit={handleSubmit}
      >
        <h2 className="2xl:text-2xl xl:text-xl font-bold mb-4">Add Product</h2>
        <label htmlFor="product_name" className="font-semibold">
          Product Name
          <input
            type="text"
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
            onChange={(e) => {
              setImageUrl(e.target.value);
              setError("");
            }}
            id="image_link"
            className="border w-full font-normal border-black focus:border-blue-500  px-3 py-2 rounded block mt-1"
          />
        </label>
        <label htmlFor="description" className="font-semibold">
          Description
          <input
            type="text"
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
            defaultValue={"Select a type"}
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
            onClick={() => navigate("/admin/products")}
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
      <div className="flex flex-col 2xl:gap-4 xl:gap-2">
        <h1 className="2xl:text-2xl xl:text-xl font-bold mb-4 text-center">
          Card Preview
        </h1>
        <div className="w-64 bg-amber-50 rounded-2xl p-3 border border-gray-100">
          <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            {imageUrl ? (
              <img src={imageUrl} alt={productName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-400">Image Preview</span>
            )}
          </div>
          <div className="text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-md w-fit mb-2">
            {type_name || "Category"}
          </div>
          <h3 className="font-bold text-[#0D1B39] line-clamp-1">
            {productName || "Product Name"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Rs. {price || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
