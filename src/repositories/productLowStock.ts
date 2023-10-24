import { ProductLowStockCount } from "./../models/ProductLowStock";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const ProductLowStockRepository =
  dataSource.getRepository(ProductLowStockCount);
export default ProductLowStockRepository;
