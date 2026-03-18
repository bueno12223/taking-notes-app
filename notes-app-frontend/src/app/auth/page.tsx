import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import SignUpForm from "@/components/forms/SignUpForm";
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
      <SignUpForm />
    </AuthLayout>
  );
}
