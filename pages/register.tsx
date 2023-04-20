import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api from "../api";
import * as Errors from "../api/errors";
import { AuthLayout } from "../components/AuthLayout";
import { TextField } from "../components/Fields";
import { Logo } from "../components/Logo";
import { Button } from "../components/Primitives/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Primitives/Dialog";
import {
  Field,
  Form,
  Input,
  Label,
  Message,
  Submit,
} from "../components/Primitives/Form";
import { ScrollArea } from "../components/Primitives/Scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/Primitives/Sheet";
import { PrivacyPolicy } from "../components/PrivacyPolicy";
import { Proposal } from "../components/Proposal";

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;

    const { data, error } = await api.users.store({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });

    if (data) {
      await api.verification.store({
        email: data.email,
      });

      await router.push({
        pathname: "/verification",
        query: { email: data.email },
      });
    }

    if (Errors.Validation.is(error)) {
      setErrors((prev) => ({ ...prev, email: true }));
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">Начните бесплатно</h2>
      <p className="mt-2 text-sm text-zinc-700">
        Уже есть аккаунт?{" "}
        <Link
          href="/login"
          className="font-medium text-lime-600 hover:underline"
        >
          Войдите
        </Link>{" "}
        в ваш аккаунт.
      </p>
      <Form onSubmit={onSubmit} className="mt-10">
        <Field name="firstName">
          <Label>Имя</Label>
          <Input type="text" autoComplete="name" required />
          <Message match="valueMissing">Введите ваше имя</Message>
        </Field>
        <Field name="lastName">
          <Label>Фамилия</Label>
          <Input type="text" autoComplete="lastName" required />
          <Message match="valueMissing">Введите вашу фамилию</Message>
        </Field>
        <Field name="email">
          <Label>Электронная почта</Label>
          <Input type="email" autoComplete="email" required />
          <Message match="badInput" forceMatch={errors.email}>
            Адрес уже используется
          </Message>
        </Field>
        <Field name="password">
          <Label>Пароль</Label>
          <Input
            type="password"
            pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Message match="patternMismatch">
            Пароль должен содержать как минимум одну цифру, одну букву и один
          </Message>
        </Field>
        <div className="text-xs">
          Регистрируясь в Limpid, вы соглашаетесь с{" "}
          <Sheet>
            <SheetTrigger asChild>
              <p className="focus inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline">
                Условиями предоставления услуг
              </p>
            </SheetTrigger>
            <SheetContent
              position="right"
              size="full"
              className=" overflow-auto"
            >
              <Proposal />
            </SheetContent>
          </Sheet>{" "}
          и{" "}
          <Sheet>
            <SheetTrigger asChild>
              <p className="inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline">
                Политикой конфиденциальности
              </p>
            </SheetTrigger>
            <SheetContent
              position="right"
              size="full"
              className=" overflow-auto"
            >
              <PrivacyPolicy />
            </SheetContent>
          </Sheet>{" "}
          Limpid.
        </div>
        <Submit>Зарегистрироваться</Submit>
      </Form>
    </AuthLayout>
  );
}
