import { User, UserService } from "@medusajs/medusa";

export const registerLoggedInUser = (req, res, next) => {
  let loggedInUser: User | null = null;
  console.log("asdasda");
  // if (req.user && req.user.userId) {
  //   const userService = req.scope.resolve("userService") as UserService;
  //   loggedInUser = await userService.retrieve(req.user.userId);
  // }

  // req.scope.register({
  //   loggedInUser: {
  //     resolve: () => loggedInUser,
  //   },
  // });

  next();
};
