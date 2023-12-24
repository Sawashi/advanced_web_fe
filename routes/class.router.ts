import { ID } from "API/router.api";

const ClassRouter = {
  value: "/classes",
  details: {
    value: (id: ID) => `/classes/${id}`,
  },
};

export default ClassRouter;
