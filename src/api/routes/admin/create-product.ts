import cors from "cors";
import { Router } from "express";

import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate";

import { UserService } from "@medusajs/medusa";
import { buildQuery } from "@medusajs/medusa";

import { EntityManager } from "typeorm";
import RoleRepository from "../../../repositories/role";
import { User } from "../../../models/User";
const router = Router();

export default function (adminCorsOptions) {
  // This router will be applied before the core routes.
  // Therefore, the middleware will be executed
  // before the create product handler is hit
  router.get(
    "/admin/products/count",
    cors(adminCorsOptions),
    authenticate(),
    (req, res) => {
      console.log("asdasdasdas");
      const productService = req.scope.resolve("productService");

      productService.count().then((count) => {
        res.json({
          count,
        });
      });
    }
  );
  // router.use("/admin/products", authenticate(), async (req, res, next) => {
  //   let loggedInUser: User | null = null;

  //   if (req.user && req.user.userId) {
  //     console.log(req.user.userId);
  //     const userService = req.scope.resolve("userService") as UserService;
  //     const loggedInUser = await userService.retrieve(req.user.userId, {
  //       select: ["id", "role_id"],
  //       relations: ["teamRole", "teamRole.permissions"],
  //     });
  //     const roleRepository: typeof RoleRepository =
  //       req.scope.resolve("roleRepository");
  //     const manager: EntityManager = req.scope.resolve("manager");
  //     // const roleRepo = manager.withRepository(roleRepository);
  //     // const result = await roleRepo.find();
  //     // console.log(result[0].permissions);
  //   }

  //   // req.scope.register({
  //   //   loggedInUser: {
  //   //     resolve: () => loggedInUser,
  //   //   },
  //   // });

  //   next();
  // });

  return router;
}
