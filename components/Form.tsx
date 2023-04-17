import * as Primitives from "@radix-ui/react-form";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Button, ButtonProps } from "./Button";

export const Form = forwardRef<
  ElementRef<typeof Primitives.Root>,
  ComponentPropsWithoutRef<typeof Primitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Root
      {...props}
      ref={ref}
      className={clsx("grid gap-x-6 gap-y-8", className)}
    />
  );
});

export const Field = forwardRef<
  ElementRef<typeof Primitives.Field>,
  ComponentPropsWithoutRef<typeof Primitives.Field>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Field {...props} ref={ref} className={clsx("grid gap-y-3")} />
  );
});

export const Label = forwardRef<
  ElementRef<typeof Primitives.Label>,
  ComponentPropsWithoutRef<typeof Primitives.Label>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Label
      {...props}
      ref={ref}
      className={clsx("block text-sm font-medium text-zinc-700", className)}
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
        "block w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
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
      className={clsx("text-sm text-red-600", className)}
    />
  );
});

export const Submit = forwardRef<
  ElementRef<typeof Primitives.Submit>,
  Omit<ComponentPropsWithoutRef<typeof Primitives.Submit>, "asChild"> &
    ButtonProps
>(
  (
    { className, variant = "solid", color = "blue", children, ...props },
    ref
  ) => {
    return (
      <Primitives.Submit {...props} ref={ref} asChild>
        <Button variant={variant} color={color} className={clsx(className)}>
          {children}
        </Button>
      </Primitives.Submit>
    );
  }
);
