interface AuthLayoutProps {
  illustration: React.ReactNode;
  heading: string;
  children: React.ReactNode;
}

export default function AuthLayout({ illustration, heading, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-brand-linen">
      <div className="w-full max-w-[384px] flex flex-col items-center gap-6">
        <div className="flex justify-center">{illustration}</div>
        <h1 className="text-heading text-brand-walnut pb-4 text-center">
          {heading}
        </h1>
        {children}
      </div>
    </div>
  );
}
