import { WeightFulfillment } from "../models/WeightFulfillment";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const WeightFulfillmentRepository =
  dataSource.getRepository(WeightFulfillment);
export default WeightFulfillmentRepository;
