const AuthenticationRouter = {
  value: "/auth",
  login: {
    value: "/login",
  },
  register: {
    value: "/register",
  },
  forgotPassword: {
    value: "/forgot-password",
    confirm: {
      value: "/forgot-password/confirm",
    },
  },
  resetPassword: {
    value: "/reset-password",
  },
  expiredToken: {
    value: "/expired-token",
  },
};

export default AuthenticationRouter;
