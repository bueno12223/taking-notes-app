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
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});
