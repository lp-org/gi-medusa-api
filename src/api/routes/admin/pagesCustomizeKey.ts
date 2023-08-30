import { Router } from "express";

import PageCustomizeKeyRepository from "../../../repositories/pageCustomizeKey";
const router = Router();
router.get("/", async (req, res) => {
  const data = await PageCustomizeKeyRepository.find();

  res.json(data);
});

export default router;
