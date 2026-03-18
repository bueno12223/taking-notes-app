import * as yup from "yup";

export interface AuthFormValues {
  email: string;
  password: string;
}

export const initialValues: AuthFormValues = {
  email: "",
  password: "",
};

export const getInitialValues = (): AuthFormValues => ({ ...initialValues });

export const signUpSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least 1 number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character")
    .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});
