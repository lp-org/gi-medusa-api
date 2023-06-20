import { Router } from "express";
import roleRouter from "./role";
import permissionRouter from "./permission";
import inviteRouter from "./invite";
import userRouter from "./user";
import authRouter from "./auth";
import errorHandler from "@medusajs/medusa/dist/api/middlewares/error-handler";
export function attachAdminRoutes(storeRouter: Router) {
  // Define a GET endpoint on the root route of our custom path
  storeRouter.use("/roles", roleRouter);

  storeRouter.use("/permissions", permissionRouter);

  storeRouter.use("/invites", inviteRouter);

  storeRouter.use("/users", userRouter);

  storeRouter.use("/auth", authRouter);
  storeRouter.use(errorHandler());
}
