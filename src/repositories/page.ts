import { Page } from "./../models/Page";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const PageRepository = dataSource.getRepository(Page);
export default PageRepository;
