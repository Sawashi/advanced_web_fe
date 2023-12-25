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
  join_class_via_token: {
    value: (token: string, classId: string) =>
      `/user/classes/join?token=${token}&classId=${classId}`,
  },
};

export default UserRouter;
