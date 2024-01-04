import { ID } from "API/router.api";

const ClassRouter = {
  value: "/classes",
  details: {
    value: (id: ID, tabName?: string) =>
      `/classes/${id}${tabName ? `?tab=${tabName}` : ""}`,
  },
};

export default ClassRouter;
