import { StoreContent } from "./../models/StoreContent";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const StoreContentRepository = dataSource.getRepository(StoreContent);
export default StoreContentRepository;
