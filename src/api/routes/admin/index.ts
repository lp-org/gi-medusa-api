import { Router } from "express";
import roleRouter from "./role";
import permissionRouter from "./permission";
import inviteRouter from "./invite";
import userRouter from "./user";
import authRouter from "./auth";
import storeContentRouter from "./store-content";
import pagesRouter from "./pages";
import pagesCustomizeKeyRouter from "./pagesCustomizeKey";
import summaryRouter from "./summary";
import lowStockRouter from "./low-stock";
import errorHandler from "@medusajs/medusa/dist/api/middlewares/error-handler";
import { permissions } from "../../middlewares/permissions";

import { wrapHandler } from "@medusajs/medusa";
import redisClient from "../../../utils/redis-client";

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
export function attachAdminRoutes(storeRouter: Router) {
  // Define a GET endpoint on the root route of our custom path
  storeRouter.use(asyncHandler(permissions));
  storeRouter.use("/roles", roleRouter);

  storeRouter.use("/permissions", permissionRouter);

  storeRouter.use("/invites", inviteRouter);

  storeRouter.use("/users", userRouter);

  storeRouter.use("/auth", authRouter);

  storeRouter.use("/store-content", storeContentRouter);
  storeRouter.use("/pages", pagesRouter);
  storeRouter.use("/pagesCustomizeKey", pagesCustomizeKeyRouter);
  storeRouter.use("/summary", summaryRouter);
  storeRouter.use("/low-stock", lowStockRouter);
  storeRouter.use(errorHandler());
}
