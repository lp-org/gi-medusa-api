import { Router } from "express";
import createProductRouter from "./routes/admin/create-product";
import { getAdminRouter } from "./routes/admin";
import { ConfigModule, authenticate } from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import cors from "cors";
export default (rootDirectory: string): Router | Router[] => {
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  const { projectConfig } = configModule;
  const corsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };
  const productRouters = [
    createProductRouter(corsOptions),
    getAdminRouter(corsOptions),
  ];

  const router = Router();

  // add your custom routes here
  return [...productRouters];
};
