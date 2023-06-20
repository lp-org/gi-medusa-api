import { wrapHandler } from "@medusajs/medusa";
import UserService from "../../../services/user";
import { Router } from "express";
import _ from "lodash";

const router = Router();

router.get(
  "/",
  wrapHandler(async (req, res) => {
    try {
      const userService: UserService = req.scope.resolve("userService");
      const user = await userService.retrieve(req.user.userId, {
        relations: ["teamRole.permissions"],
      });

      const cleanRes = _.omit(user, ["password_hash"]);
      res.status(200).json({ user: cleanRes });
    } catch (err) {
      res.sendStatus(400);
    }
  })
);
export default router;
