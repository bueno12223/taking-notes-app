"use client";

import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { getInitialValues, signUpSchema } from "@/components/forms/AuthForm/validations";
import catImage from "@/assets/cat.webp";

export default function AuthPage() {
  const illustration = (
    <Image
      src={catImage}
      alt="Cat illustration"
      width={188}
      height={134}
      priority
    />
  );

  return (
    <AuthLayout illustration={illustration} heading="Yay, New Friend!">
      <AuthForm
        initialValues={getInitialValues()}
        validationSchema={signUpSchema}
        buttonLabel="Sign Up"
        footerLabel="We're already friends!"
        footerHref="/login"
        onSubmit={(values) => console.log("Sign Up:", values)}
      />
    </AuthLayout>
  );
}
