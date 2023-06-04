import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-[90vh] justify-center md:px-12 lg:px-0">
      <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 sm:justify-center md:flex-none md:px-28">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
}
