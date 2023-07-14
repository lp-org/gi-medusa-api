import { Router } from "express";
import storeContentRouter from "./store-content";
import pageRouter from "./pages";
import geoipRouter from "./geoip";
// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/store-content", storeContentRouter);

  storeRouter.use("/pages", pageRouter);
  storeRouter.use("/geoip", geoipRouter);
}
