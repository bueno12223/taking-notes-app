"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { getInitialValues, signUpSchema, AuthFormValues } from "@/components/forms/AuthForm/validations";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyErrorMessage } from "@/lib/error-mapping";
import catImage from "@/assets/cat.webp";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      await signUp(values.email, values.password);
      toast.success("Account created! Please check your email to verify.");
      router.push("/login");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    }
  };

  const illustration = (
    <Image src={catImage} alt="Cat illustration" width={188} height={134} priority />
  );

  return (
    <AuthLayout illustration={illustration} heading="Yay, New Friend!">
      <AuthForm
        initialValues={getInitialValues()}
        validationSchema={signUpSchema}
        buttonLabel="Sign Up"
        footerLabel="We're already friends!"
        footerHref="/login"
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
}
