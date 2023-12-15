import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authenticate, ConfigModule } from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import { attachStoreRoutes } from "./routes/store";
import { attachAdminRoutes } from "./routes/admin";
import { attachPaymentRoutes } from "./routes/payment";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { IsString, IsOptional } from "class-validator";

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsString()
  @IsOptional()
  description_2: string;
}

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsString()
  @IsOptional()
  description_2: string;
}

registerOverriddenValidators(AdminPostProductsReq);
registerOverriddenValidators(AdminPostProductsProductReq);
export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded medusa config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  const { projectConfig } = configModule;

  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  // Set up express router
  const router = Router();

  // Set up root routes for store and admin endpoints, with appropriate CORS settings
  router.use("/store", cors(storeCorsOptions), bodyParser.json());
  router.use("/admin", cors(adminCorsOptions), bodyParser.json());
  router.use("/payment", cors(storeCorsOptions));
  // Add authentication to all admin routes *except* auth and account invite ones
  router.use(/\/admin\/((?!auth).*)/, authenticate());

  // Set up routers for store and admin endpoints
  const storeRouter = Router();
  const adminRouter = Router();
  const paymentRouter = Router();
  // Attach these routers to the root routes
  router.use("/store", storeRouter);
  router.use("/admin", adminRouter);
  router.use("/payment", paymentRouter);
  // Attach custom routes to these routers
  attachStoreRoutes(storeRouter);
  attachAdminRoutes(adminRouter);
  attachPaymentRoutes(paymentRouter);
  return router;
};
