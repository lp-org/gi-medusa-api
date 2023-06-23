import { User } from "@medusajs/medusa";
import client from "../../utils/redis-client";
import { NextFunction, Request, Response } from "express";
import UserService from "../../services/user";
import { permissionList } from "../../utils/permissions";
import { MedusaError } from "@medusajs/utils";

export async function permissions(req: Request, res: Response, next) {
  const path = req.path;
  const userService: UserService = req.scope.resolve("userService");

  if (req.user?.userId) {
    const perms = await userService.retrieveUserPermission(req.user.userId);
    const flattenPerms = perms.map((el) => el.name);
    const inPerm = permissionList.find((el) =>
      el.endpoints?.some((endpoint) => {
        const reg = new RegExp(endpoint.path);
        return reg.test(path) && req.method === endpoint.method;
      })
    );

    if (inPerm) {
      if (flattenPerms.includes(inPerm.name)) {
        return next();
      } else {
        throw new MedusaError(
          MedusaError.Types.UNAUTHORIZED,
          `You don't have ${inPerm.name} permission`
        );
      }
    }
  }

  next();
}
