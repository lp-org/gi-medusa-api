import { Router } from "express";
import StoreContentRepository from "../../../repositories/storeContent";
import {
  // alias the core repository to not cause a naming conflict
  StoreRepository,
} from "@medusajs/medusa/dist/repositories/store";
import PageRepository from "../../../repositories/page";
const router = Router();
router.get("/", async (req, res) => {
  const store = await StoreRepository.find();
  const name = store[0].name;
  const data = await StoreContentRepository.find();
  const pages = await PageRepository.find({
    select: {
      id: true,
      title: true,
    },
    where: { publish: true, customize: false },
    order: {
      rank: "ASC",
    },
  });
  res.json({ name, ...data[0], pages });
});

export default router;
