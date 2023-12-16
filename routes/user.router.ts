const UserRouter = {
  value: "/user",
  profile: {
    value: "/user/profile",
  },
  home: {
    value: "/user/home",
  },
  enrolled_classes: {
    value: "/user/classes/enrolled",
  },
  owned_classes: {
    value: "/user/classes/owned",
  },
  class: {
    value: (id: string) => `/user/class/${id}`,
  },
};

export default UserRouter;
