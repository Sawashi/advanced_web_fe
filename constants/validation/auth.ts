import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('This field is required')
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Email must be a valid email'),
  password: yup.string().required('This field is required')
})

export const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('This field is required')
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Email must be a valid email')
})

export const SelectFleetSchema = yup.object().shape({
  fleet: yup.string().required('This field is required')
})
