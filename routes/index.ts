import AuthenticationRouter from "./auth.router";
import ClassRouter from "./class.router";
import UserRouter from "./user.router";
import AdminRouter from "./admin.router";
import ErrorRouter from "./error.router";
const routes = {
  auth: AuthenticationRouter,
  user: UserRouter,
  classes: ClassRouter,
  admin: AdminRouter,
  error: ErrorRouter,
};

export default routes;
