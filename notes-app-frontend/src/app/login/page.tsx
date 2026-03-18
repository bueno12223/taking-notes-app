"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { getInitialValues, loginSchema, AuthFormValues } from "@/components/forms/AuthForm/validations";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyErrorMessage } from "@/lib/error-mapping";
import cactusImage from "@/assets/cactus.webp";
import { useState } from "react";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
      router.push("/home");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const illustration = (
    <Image src={cactusImage} alt="Cactus illustration" width={95} height={114} priority />
  );

  return (
    <AuthLayout illustration={illustration} heading="Yay, You're Back!">
      <AuthForm
        initialValues={getInitialValues()}
        validationSchema={loginSchema}
        buttonLabel="Login"
        footerLabel="Oops! I've never been here before"
        footerHref="/signup"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </AuthLayout>
  );
}
