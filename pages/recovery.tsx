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
  });

  const clearErrors = () => {
    setErrors({
      email: false,
    });
  };

  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      email: string;
    };

    const { error } = await api.recovery.store({
      email: values.email,
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
      pathname: "/recovery-pass",
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
        <Submit>Отправить запрос</Submit>
      </Form>
    </AuthLayout>
  );
}
