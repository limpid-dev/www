import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormEvent, useState } from "react";
import api, { AxiosError } from "../api";
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

export default function Login() {
  const router = useRouter();

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as {
      email: string;
      password: string;
    };

    try {
      await api.loginUser(values.email, values.password);

      await router.push({ pathname: "/app/projects" });
    } catch (error) {
      if (error instanceof Error) {
        const status = (error as AxiosError).response?.status;
        if (status === 422) {
          setErrors((prev) => ({
            ...prev,
            email: true,
          }));
          return;
        }

        if (status === 400) {
          setErrors((prev) => ({
            ...prev,
            password: true,
          }));
        }
      }
    }
  };

  const { t } = useTranslation("common");

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">{t("log_in_1")}</h2>
      <p className="mt-2 text-sm text-zinc-700">
        {t("no_account")}{" "}
        <Link
          href="/register"
          className="font-medium text-lime-600 hover:underline"
        >
          {t("register")}
        </Link>{" "}
        {t("now")}
      </p>
      <Form
        onSubmit={onSubmit}
        className="mt-10"
        onClearServerErrors={clearErrors}
      >
        <Field name="email">
          <Label>{t("email")}</Label>
          <Input
            type="email"
            autoComplete="email"
            onChange={clearErrors}
            defaultValue={router.query.email}
            required
          />
          <Message match="badInput" forceMatch={errors.email}>
            {t("mail_error")}
          </Message>
        </Field>
        <Field name="password">
          <Label>{t("password")}</Label>
          <Input
            type="password"
            minLength={8}
            onChange={clearErrors}
            autoComplete="current-password"
            required
          />
          <Message match="patternMismatch">{t("password_error")}</Message>
          <Message match="badInput" forceMatch={errors.password}>
            {t("incorrect_password")}
          </Message>
        </Field>
        <Link
          href="./recovery"
          className="font-medium text-sm text-right text-lime-600 hover:underline"
        >
          {t("forget_password")}
        </Link>
        <Submit>{t("log_in")}</Submit>
      </Form>
    </AuthLayout>
  );
}
