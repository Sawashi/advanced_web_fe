const UserRouter = {
  value: "/user",
  profile: {
    value: "/user/profile",
  },
  home: {
    value: "/user/home",
  },
  classes: {
    value: "/user/classes",
  },
  class: {
    value: (id: string) => `/user/class/${id}`,
  },
};

export default UserRouter;
