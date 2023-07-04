import { Router } from "express";
import PageRepository from "../../../repositories/page";
import { MedusaError } from "@medusajs/utils";
import {
  wrapHandler,
  transformQuery,
  FindPaginationParams,
} from "@medusajs/medusa";
const router = Router();
router.get(
  "/:handle",
  wrapHandler(async (req, res) => {
    const data = await PageRepository.findOne({
      where: { handle: req.params.handle, publish: true },
    });
    if (!data) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Page not found");
    }
    res.json(data);
  })
);

export default router;
