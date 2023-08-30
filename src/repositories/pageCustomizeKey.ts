import { PageCustomizeKey } from "./../models/PageCustomizeKey";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const PageCustomizeKeyRepository =
  dataSource.getRepository(PageCustomizeKey);
export default PageCustomizeKeyRepository;
