import { Router } from "express";

import { errorHandler } from "@medusajs/medusa";
import ipay88Router from "./ipay88";
export function attachPaymentRoutes(storeRouter: Router) {
  // Define a GET endpoint on the root route of our custom path
  storeRouter.use("/ipay88", ipay88Router);

  storeRouter.use(errorHandler());
}
