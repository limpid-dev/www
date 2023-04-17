import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api from "../api";
import { BadRequest, Validation } from "../api/errors";
import { AuthLayout } from "../components/AuthLayout";
import { Field, Form, Input, Label, Message, Submit } from "../components/Form";

export default function Recovery() {
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    token: false,
  });

  const clearErrors = () => {
    setErrors({
      email: false,
      password: false,
      token: false,
    });
  };

  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      email: string;
      password: string;
      token: string;
    };

    const { error } = await api.recovery.update({
      email: values.email,
      password: values.password,
      token: values.token,
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
      pathname: "/login",
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">
        Восстановление пароля
      </h2>
      <Form
        onSubmit={onSubmit}
        className="mt-10"
        onClearServerErrors={clearErrors}
      >
        <Field name="email">
          <Label>Электронная почта</Label>
          <Input type="email" autoComplete="email" required />
          <Message match="valueMissing">Введите пожалуйста вашу почту</Message>
          <Message match="typeMismatch">Введите валидную почту</Message>
          <Message match="badInput" forceMatch={errors.email}>
            Адрес не найден или не верифицирован
          </Message>
        </Field>
        <Field name="password">
          <Label>Новый пароль</Label>
          <Input type="password" autoComplete="email" required />
          <Message match="valueMissing">Введите пожалуйста ваш пароль</Message>
          <Message match="tooShort">
            Пароль должен содержать минимум 8 символов
          </Message>
          <Message match="patternMismatch">
            Пароль должен содержать как минимум одну цифру, одну букву и один
            спецсимвол
          </Message>
        </Field>
        <Field name="token">
          <Label>Код пришедший на почту</Label>
          <Input required minLength={6} />
          <Message match="valueMissing">Пожалуйста введите код</Message>
        </Field>
        <Submit>Отправить запрос</Submit>
      </Form>
    </AuthLayout>
  );
}
