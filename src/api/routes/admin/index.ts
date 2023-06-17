import cors from "cors";
import { Router } from "express";
import bodyParser from "body-parser";
import customRouteHandler from "./custom-route-handler";
import { authenticate, wrapHandler } from "@medusajs/medusa";
import errorHandler from "@medusajs/medusa/dist/api/middlewares/error-handler";
import roleRouter from "./role";

const adminRouter = Router();
export function getAdminRouter(adminCorsOptions): Router {
  adminRouter.use(
    /\/admin\/((?!auth).*)/,
    cors(adminCorsOptions),
    bodyParser.json(),
    authenticate()
  );

  adminRouter.use("/admin", roleRouter);
  adminRouter.use(errorHandler());
  return adminRouter;
}
