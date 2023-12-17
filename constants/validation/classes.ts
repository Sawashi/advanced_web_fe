import * as yup from "yup";
// "Class codes are 6 characters including letters and numbers, and no spaces or symbols"

export const ClassCodeSchema = yup.object().shape({
  classCode: yup
    .string()
    .required("Enter a class code to join a class")
    .matches(
      /^[a-zA-Z0-9]{6}$/,
      "Class codes are 6 characters including letters and numbers, and no spaces or symbols"
    ),
});

// Types
export type IClassCodeSchema = yup.InferType<typeof ClassCodeSchema>;
