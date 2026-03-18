"use client";

import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { getInitialValues, loginSchema } from "@/components/forms/AuthForm/validations";
import cactusImage from "@/assets/cactus.webp";

export default function LoginPage() {
  const illustration = (
    <Image
      src={cactusImage}
      alt="Cactus illustration"
      width={95}
      height={114}
      priority
    />
  );

  return (
    <AuthLayout illustration={illustration} heading="Yay, You're Back!">
      <AuthForm
        initialValues={getInitialValues()}
        validationSchema={loginSchema}
        buttonLabel="Login"
        footerLabel="Oops! I've never been here before"
        footerHref="/signup"
        onSubmit={(values) => console.log("Login:", values)}
      />
    </AuthLayout>
  );
}
