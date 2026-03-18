"use client";

import Link from "next/link";
import AuthInput from "@/components/auth/AuthInput";
import Button from "@/components/ui/Button";
import { useCustomForm } from "@/hooks/use-custom-form";
import { Schema } from "yup";
import { AuthFormValues } from "./validations";

interface AuthFormProps {
  initialValues: AuthFormValues;
  validationSchema: Schema<AuthFormValues>;
  buttonLabel: string;
  footerLabel: string;
  footerHref: string;
  onSubmit: (values: AuthFormValues) => void;
}

export default function AuthForm({
  initialValues,
  validationSchema,
  buttonLabel,
  footerLabel,
  footerHref,
  onSubmit,
}: AuthFormProps) {
  const form = useCustomForm<AuthFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => onSubmit(values),
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
        error={form.touched.email ? (form.errors.email as string) : undefined}
      />
      <AuthInput
        type="password"
        placeholder="Password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.password ? (form.errors.password as string) : undefined}
      />
      <div className="flex flex-col items-center gap-[12px] mt-6">
        <Button label={buttonLabel} type="submit" fullWidth />
        <Link
          href={footerHref}
          className="text-[12px] font-normal font-sans underline text-brand-gold"
        >
          {footerLabel}
        </Link>
      </div>
    </form>
  );
}
