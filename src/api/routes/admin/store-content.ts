import { Router } from "express";
import {
  wrapHandler,
  transformQuery,
  FindPaginationParams,
} from "@medusajs/medusa";
import RoleRepository from "../../../repositories/role";
import { IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import StoreContentRepository from "../../../repositories/storeContent";
import {
  // alias the core repository to not cause a naming conflict
  StoreRepository,
} from "@medusajs/medusa/dist/repositories/store";

const router = Router();
router.get("/", async (req, res) => {
  const data = await StoreContentRepository.find();
  res.json(data[0]);
});

router.post(
  "/",
  wrapHandler(async (req, res) => {
    const store = await StoreRepository.find();
    const data = await StoreContentRepository.find();
    if (!data[0]) {
      const content = StoreContentRepository.create({
        store_id: store[0].id,
        ...req.body,
      });
      await StoreContentRepository.save(content);
    } else {
      await StoreContentRepository.update({}, req.body);
    }

    res.json({ success: true });
  })
);

export default router;
