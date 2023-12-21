const UserRouter = {
  value: "/user",
  profile: {
    value: "/user/profile",
    change_password: {
      value: "/user/profile/change-password",
    },
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
  teaching_classes: {
    value: "/user/classes/teaching",
  },
  class: {
    value: (id: string) => `/user/class/${id}`,
  },
};

export default UserRouter;
