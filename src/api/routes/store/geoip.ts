import { wrapHandler } from "@medusajs/medusa";
import geoip from "geoip-lite";
import { Router } from "express";
const router = Router();
router.get(
  "/",

  wrapHandler(async (req, res) => {
    try {
      const ip = req.headers["cf-connecting-ip"] || req.socket.remoteAddress;
      var geo = geoip.lookup(ip);
      res.status(200).json(geo);
    } catch (err) {
      res.sendStatus(400);
    }
  })
);

export default router;
