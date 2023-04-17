import * as Primitives from "@radix-ui/react-form";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

export const Form = Primitives.Root;

export const Field = forwardRef<
  ElementRef<typeof Primitives.Field>,
  ComponentPropsWithoutRef<typeof Primitives.Field>
>((props, ref) => {
  return <Primitives.Field {...props} ref={ref} className="mt-6" />;
});

export const Label = forwardRef<
  ElementRef<typeof Primitives.Label>,
  ComponentPropsWithoutRef<typeof Primitives.Label>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Label
      {...props}
      ref={ref}
      className={clsx(
        "block text-sm font-medium leading-6 text-zinc-900",
        className
      )}
    />
  );
});

export const Input = forwardRef<
  ElementRef<typeof Primitives.Control>,
  ComponentPropsWithoutRef<typeof Primitives.Control>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Control
      {...props}
      ref={ref}
      className={clsx(
        "block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 disabled:ring-zinc-200 sm:text-sm sm:leading-6"
      )}
    />
  );
});

export const Message = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<typeof Primitives.Message>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Message
      {...props}
      ref={ref}
      className={clsx("text-sm text-zinc-500", className)}
    />
  );
});
