import * as yup from "yup";

export const ClassCodeSchema = yup.object().shape({
  classCode: yup
    .string()
    .required("Enter a class code to join a class")
    .matches(
      /^[a-zA-Z0-9]{5,7}$/,
      "Class codes are 5-7 characters including letters and numbers, and no spaces or symbols"
    ),
});

// Types
export type IClassCodeSchema = yup.InferType<typeof ClassCodeSchema>;
