import { EReviewStatus } from "enums/classes";
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

export const GradeCompositionSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(1, "Name must not be empty")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain letters, numbers, and spaces"
    ),
  percentage: yup
    .number()
    .required("Percentage is required")
    .typeError("Percentage must be a number")
    .min(0, "Percentage must be greater than or equal to 0")
    .max(100, "Percentage must be less than or equal to 100"),
});

export const RequestReviewGradeSchema = yup.object().shape({
  explanation: yup
    .string()
    .trim()
    .required("Explanation is required")
    .min(1, "Explanation must not be empty"),
  expectedGrade: yup
    .number()
    .required("Expected grade is required")
    .typeError("Expected grade must be a number")
    .min(0, "Expected grade must be greater than or equal to 0")
    .max(100, "Expected grade must be less than or equal to 100"),
});

export const ReviewGradeSchema = yup.object().shape({
  finalGrade: yup
    .number()
    .required("Final grade is required")
    .typeError("Final grade must be a number")
    .min(0, "Final grade must be greater than or equal to 0")
    .max(100, "Final grade must be less than or equal to 100"),
});

// Types
export type IClassCodeSchema = yup.InferType<typeof ClassCodeSchema>;
export type IClassInformationSchema = yup.InferType<
  typeof ClassInformationSchema
>;
export type IUpdateClassSchema = yup.InferType<typeof UpdateClassSchema>;
export type IInviteEmailsSchema = yup.InferType<typeof InviteEmailsSchema>;
export type IGradeCompositionSchema = yup.InferType<
  typeof GradeCompositionSchema
>;
export type IRequestReviewGradeSchema = yup.InferType<typeof RequestReviewGradeSchema>;
export type IReviewGradeSchema = yup.InferType<typeof ReviewGradeSchema>;
