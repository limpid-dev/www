import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function GeneralLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 pt-4 px-5">
      <div className="mx-auto max-w-screen-xl">{children}</div>
    </div>
  );
}
