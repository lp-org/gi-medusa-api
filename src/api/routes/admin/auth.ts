import { authenticate, wrapHandler } from "@medusajs/medusa";
import UserService from "../../../services/user";
import { Router } from "express";
import _ from "lodash";
import { permissionList } from "../../../utils/permissions";
import geoip from "geoip-lite";
const router = Router();
router.delete(
  "/",
  authenticate(),
  wrapHandler(async (req, res) => {
    //@ts-ignore
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.end();
    res.status(200);
  })
);

router.get(
  "/",
  authenticate(),
  wrapHandler(async (req, res) => {
    try {
      let result;
      const userService: UserService = req.scope.resolve("userService");
      const user = await userService.retrieve(req.user.userId, {
        relations: ["teamRole.permissions"],
      });
      result = { ...user };
      if (user.metadata) {
        if (user.metadata.superadmin) {
          result = {
            ...result,
            teamRole: {
              name: "superadmin",
              permissions: permissionList,
            },
          };
          //   user.teamRole = "superadmin";
          //   user.teamRole.permissions = permissionList;
        }
      }

      const cleanRes = _.omit(result, ["password_hash"]);
      res.status(200).json({ user: cleanRes });
    } catch (err) {
      res.sendStatus(400);
    }
  })
);

router.get(
  "/geoinfo",

  wrapHandler(async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      console.log(req.headers["x-forwarded-for"], req.socket.remoteAddress);
      var geo = geoip.lookup(ip);
      res.status(200).json(geo);
    } catch (err) {
      res.sendStatus(400);
    }
  })
);

export default router;
