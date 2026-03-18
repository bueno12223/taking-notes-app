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
import { useState, useEffect } from "react";

export default function SignUpPage() {
  const { user, isLoading, signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.push("/home");
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-linen">
        <span className="text-brand-gold font-sans text-sm">Loading...</span>
      </div>
    );
  }

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      setLoading(true);
      await signUp(values.email, values.password);
      toast.success("Account created! Please login");
      router.push("/login");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
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
        loading={loading}
      />
    </AuthLayout>
  );
}
