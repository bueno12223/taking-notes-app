"use client";

import Link from "next/link";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { useCustomForm } from "@/hooks/use-custom-form";
import { getInitialValues, signUpSchema, SignUpFormValues } from "./validations";

export default function SignUpForm() {
  const form = useCustomForm<SignUpFormValues>({
    initialValues: getInitialValues(),
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="w-full flex flex-col gap-[12px]">
      <AuthInput
        type="email"
        placeholder="Email address"
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.email ? form.errors.email : undefined}
      />
      <AuthInput
        type="password"
        placeholder="Password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.password ? form.errors.password : undefined}
      />
      <div className="flex flex-col items-center gap-[12px] mt-6">
        <AuthButton label="Sign Up" type="submit" />
        <Link
          href="/auth/login"
          className="text-[12px] font-normal font-sans underline text-brand-gold"
        >
          We&apos;re already friends!
        </Link>
      </div>
    </form>
  );
}
