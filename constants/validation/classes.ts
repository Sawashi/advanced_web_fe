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

export const ClassInformationSchema = yup.object().shape({
  nameOfClass: yup
    .string()
    .trim()
    .required("Class name is required")
    .min(1, "Class name must not be empty")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Class name can only contain letters, numbers, and spaces"
    ),
  descriptionOfClass: yup.string().trim(),
});

export const UpdateClassSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Class name is required")
    .min(1, "Class name must not be empty")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Class name can only contain letters, numbers, and spaces"
    ),
  description: yup.string().trim(),
});

export const InviteEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const InviteEmailsSchema = yup.object().shape({
  emails: yup.array().of(InviteEmailSchema).min(1, "Enter at least one email"),
});

// Types
export type IClassCodeSchema = yup.InferType<typeof ClassCodeSchema>;
export type IClassInformationSchema = yup.InferType<
  typeof ClassInformationSchema
>;
export type IUpdateClassSchema = yup.InferType<typeof UpdateClassSchema>;
export type IInviteEmailsSchema = yup.InferType<typeof InviteEmailsSchema>;
