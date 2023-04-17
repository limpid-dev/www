import * as Primitives from "@radix-ui/react-form";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const Form = Primitives.Root;

export const Field = Primitives.Field;

export const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(({ children, ...props }, ref) => {
  return (
    <Primitives.Label {...props} ref={ref} asChild>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {children}
      </label>
    </Primitives.Label>
  );
});
