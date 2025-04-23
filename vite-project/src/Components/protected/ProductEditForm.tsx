import { ProductsType } from "./AdminProducts";

type ProductEditType = {
  selectedProduct: ProductsType | null;
  closeModal: () => void;
};

const ProductEditForm = ({ selectedProduct, closeModal }: ProductEditType) => {
  return <div>{selectedProduct?.name}</div>;
};

export default ProductEditForm;
