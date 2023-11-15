import AuthenticationRouter from "./auth.router";
import UserRouter from "./user.router";

const routes = {
  home: {
    value: "/home",
  },
  auth: AuthenticationRouter,
  user: UserRouter
};

export default routes;
