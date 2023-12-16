import AuthenticationRouter from "./auth.router";
import MainRouter from "./main.router";
import UserRouter from "./user.router";

const routes = {
  auth: AuthenticationRouter,
  user: UserRouter
};

export default routes;
