import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api from "../api";
import { BadRequest, Validation } from "../api/errors";
import { AuthLayout } from "../components/AuthLayout";
import { Field, Form, Input, Label, Message, Submit } from "../components/Form";

export default function Login() {
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const clearErrors = () => {
    setErrors({
      email: false,
      password: false,
    });
  };

  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      email: string;
      password: string;
    };

    const { error } = await api.session.store({
      email: values.email,
      password: values.password,
      mode: "web",
    });

    if (Validation.is(error)) {
      setErrors((prev) => ({
        ...prev,
        email: true,
      }));
      return;
    }

    if (BadRequest.is(error)) {
      setErrors((prev) => ({
        ...prev,
        password: true,
      }));
      return;
    }

    await router.push({
      pathname: "/",
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-gray-900">
        Войдите в свой аккаунт
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Еще нет аккаунта?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Зарегистрируйтесь
        </Link>{" "}
        сейчас.
      </p>
      <Form
        onSubmit={onSubmit}
        className="mt-10"
        onClearServerErrors={clearErrors}
      >
        <Field name="email">
          <Label>Электронная почта</Label>
          <Input
            type="email"
            autoComplete="email"
            defaultValue={router.query.email}
            required
          />
          <Message match="badInput" forceMatch={errors.email}>
            Адрес не найден или не верифицирован
          </Message>
        </Field>
        <Field name="password">
          <Label>Пароль</Label>
          <Input
            type="password"
            autoComplete="current-password"
            pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+"
            required
          />
          <Message match="patternMismatch">
            Пароль должен содержать как минимум одну цифру, одну букву и один
            спецсимвол
          </Message>
          <Message
            onChange={clearErrors}
            match="badInput"
            forceMatch={errors.password}
          >
            Неверный пароль
          </Message>
        </Field>
        <Submit>Войти</Submit>
      </Form>
    </AuthLayout>
  );
}
