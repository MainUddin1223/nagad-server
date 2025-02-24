import express from "express";
import config from "../utils/config/index.js";
import authRouter from "../module/auth/auth.route.js";
const router = express.Router();
const defaultRoutes = [
  {
    path: "/auth",
    route: authRouter.authRouter,
  },
  //   {
  //     path: "/owner",
  //     route: ownerRouter.ownerRouter,
  //   },
  //   {
  //     path: "/renter",
  //     route: renterRouter.renterRouter,
  //   },
  //   {
  //     path: "/house",
  //     route: houseRouter.houseRouter,
  //   },
];
defaultRoutes.forEach((route) => {
  const apis = route.route.stack.map((path) => {
    return { path: path.route.path, methods: path.route.methods };
  });
  apis.map((api) => {
    console.log([
      api.methods,
      {
        route: `${config.server_url}${config.api_route}${route.path}${api.path}`,
      },
    ]);
  });
  router.use(route.path, route.route);
});

export default router;
