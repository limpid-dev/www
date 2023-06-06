import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormEvent, useState } from "react";
import api from "../api";
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

  const [errors, setErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;

    await api
      .createUser({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        born_at:'',
        patronymic:''
      })
      .then((response) => {
        if (response.status === 201) {
          api.verifyEmailRequest(values.email);
          router.push({
            pathname: "/verification",
            query: { email: values.email },
          });
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const { t } = useTranslation("common");

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">
        {t("start_free_r")}
      </h2>
      <p className="mt-2 text-sm text-zinc-700">
        {t("have_account")} {t("r_log_in_r")}{" "}
        <Link
          href="/login"
          className="font-medium text-lime-600 hover:underline"
        >
          {t("r_log_in")}
        </Link>{" "}
        {t("r_ur_account")}
      </p>
      <Form onSubmit={onSubmit} className="mt-10">
        <Field name="firstName">
          <Label>{t("name")}</Label>
          <Input type="text" autoComplete="name" required />
          <Message match="valueMissing">{t("name_required")}</Message>
        </Field>
        <Field name="lastName">
          <Label>{t("surname")}</Label>
          <Input type="text" autoComplete="lastName" required />
          <Message match="valueMissing">{t("surname_required")}</Message>
        </Field>
        <Field name="email">
          <Label>{t("email")}</Label>
          <Input type="email" autoComplete="email" required />
          <Message match="valueMissing">{t("email_required")}</Message>
          <Message match="badInput" forceMatch={errors.email}>
            {t("address_in_use_error")}
          </Message>
        </Field>
        <Field name="password">
          <Label>{t("password")}</Label>
          <Input
            type="password"
            pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Message match="valueMissing">{t("password_required")}</Message>
          <Message match="patternMismatch">{t("password_error")}</Message>
          <Message match="tooShort">{t("password_tooShort")}</Message>
        </Field>
        <div className="text-xs">
          {t("terms")}{" "}
          <Link
            href="/terms-and-conditions"
            className="focus inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline"
          >
            {t("terms_2")}
          </Link>{" "}
          {t("and")}{" "}
          <Link
            href="/privacy-policy"
            className="inline-block w-fit cursor-pointer font-semibold text-lime-600 hover:underline"
          >
            {t("terms_3")}
          </Link>
        </div>
        <Submit>{t("to_register")}</Submit>
      </Form>
    </AuthLayout>
  );
}
