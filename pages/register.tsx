import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api from "../api";
import * as Errors from "../api/errors";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";
import { Field, Form, Input, Label, Message, Submit } from "../components/Form";
import { Logo } from "../components/Logo";

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;

    const [firstName, lastName] = values.fullName.trim().split(" ");

    const { data, error } = await api.users.store({
      firstName,
      lastName,
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
      <h2 className="text-lg font-semibold text-gray-900">Начните бесплатно</h2>
      <p className="mt-2 text-sm text-gray-700">
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
        <Field name="fullName">
          <Label>Полное имя</Label>
          <Input
            type="text"
            pattern="^[a-zA-Z]+ [a-zA-Z]+$"
            autoComplete="name"
            required
          />
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
            required
          />
          <Message match="patternMismatch">
            Пароль должен содержать как минимум одну цифру, одну букву и один
          </Message>
        </Field>
        <Submit>Зарегистрироваться</Submit>
      </Form>
    </AuthLayout>
  );
}
