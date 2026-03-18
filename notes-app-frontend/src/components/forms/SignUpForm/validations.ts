import * as yup from "yup";

export interface SignUpFormValues {
  email: string;
  password: string;
}

export const initialValues: SignUpFormValues = {
  email: "",
  password: "",
};

export const getInitialValues = (): SignUpFormValues => ({ ...initialValues });

export const signUpSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});
