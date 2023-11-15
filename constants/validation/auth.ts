import { DATE_PATTERN, PASSWORD_PATTERN } from "constants/common";
import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("This field is required"),
  password: yup.string().required("This field is required"),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("This field is required"),
});

export const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("This field is required"),
  password: yup
    .string()
    .required("This field is required")
    .matches(
      PASSWORD_PATTERN,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    ),
  dob: yup.string().test("Invalid date", "Invalid date", (value) => {
    if (value) {
      if (!DATE_PATTERN.test(value)) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return true;
  }),
  firstName: yup.string().required("This field is required"),
  lastName: yup.string().required("This field is required"),
});

export const EditProfileSchema = yup.object().shape({
  dob: yup.string().test("Invalid date", "Invalid date", (value) => {
    if (value) {
      if (!DATE_PATTERN.test(value)) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return true;
  }),
  firstName: yup.string().required("This field is required"),
  lastName: yup.string().required("This field is required"),
});

export type ILoginSchema = yup.InferType<typeof LoginSchema>;
export type IForgotPasswordSchema = yup.InferType<typeof ForgotPasswordSchema>;
export type IRegisterSchema = yup.InferType<typeof RegisterSchema>;
export type IEditProfileSchema = yup.InferType<typeof EditProfileSchema>;
