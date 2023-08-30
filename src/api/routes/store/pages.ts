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
    const customize = req.query.customize;
    const data = await PageRepository.findOne({
      where: {
        handle: req.params.handle,
        publish: true,
        customize: customize == "1" ? true : false,
      },
    });
    if (!data) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Page not found");
    }
    res.json(data);
  })
);

export default router;
