import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api";
import { BadRequest, Unauthorized, Validation } from "../api/errors";
import { AuthLayout } from "../components/auth-layout";
import {
  Field,
  Form,
  Input,
  Label,
  Message,
  Submit,
} from "../components/primitives/form";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common"])),
  },
});
export default function Register() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [errors, setErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;

    const { data: users, error: users_error } = await api.users.store({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
    });

    if (users) {
      const { error: session_error } = await api.session.store({
        email: values.email,
        password: values.password,
      });
      if (Validation.is(session_error)) {
        setErrors((prev) => ({
          ...prev,
          email: true,
        }));
        return;
      }

      if (BadRequest.is(session_error)) {
        setErrors((prev) => ({
          ...prev,
          password: true,
        }));
        return;
      }

      if (Unauthorized.is(session_error)) {
        setErrors((prev) => ({
          ...prev,
          email: true,
        }));
      }

      localStorage.clear();

      await router.push({
        pathname: "/app/projects",
      });
    }

    if (Validation.is(users_error)) {
      setErrors((prev) => ({ ...prev, email: true }));
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">
        {t("start_free_r")}
      </h2>
      <p className="mt-2 text-sm text-zinc-700">
        {t("have_account")} {t("r_log_in")}{" "}
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
          <Link
            href="/terms-and-conditions"
            className="focus inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline"
          >
            Условиями предоставления услуг
          </Link>{" "}
          и{" "}
          <Link
            href="/privacy-policy"
            className="inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline"
          >
            Политикой конфиденциальности
          </Link>{" "}
          Limpid.
        </div>
        <Submit>Зарегистрироваться</Submit>
      </Form>
    </AuthLayout>
  );
}
