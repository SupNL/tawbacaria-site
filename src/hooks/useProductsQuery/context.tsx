import { createContext } from "react";

const ProductsQueryContext = createContext<ProductsQueryProps | null>(null);
export default ProductsQueryContext;