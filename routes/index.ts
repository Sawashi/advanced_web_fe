import AuthenticationRouter from "./auth.router";
import ClassRouter from "./class.router";
import MainRouter from "./main.router";
import UserRouter from "./user.router";

const routes = {
  auth: AuthenticationRouter,
  user: UserRouter,
  classes: ClassRouter,
};

export default routes;
