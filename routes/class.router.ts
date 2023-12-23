import { ID } from "API/router";

const ClassRouter = {
  value: "/classes",
  details: {
    value: (id: ID) => `/classes/${id}`,
  },
};

export default ClassRouter;
