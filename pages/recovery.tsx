import { GetStaticProps } from "next";
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

    await api.recoverPassword({
      email: values.email,
    });

    await router.push({
      pathname: "/recovery-pass",
    });
  };

  const { t } = useTranslation("common");

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-zinc-900">
        {t("password_recovery")}
      </h2>
      <Form
        onSubmit={onSubmit}
        className="mt-10"
        onClearServerErrors={clearErrors}
      >
        <Field name="email">
          <Label>{t("email")}</Label>
          <Input type="email" autoComplete="email" required />
          <Message match="valueMissing">{t("email_required")}</Message>
          <Message match="typeMismatch">{t("invalid_email")}</Message>
          <Message match="badInput" forceMatch={errors.email}>
            {t("mail_error")}
          </Message>
        </Field>
        <Submit>{t("recover_password")}</Submit>
      </Form>
    </AuthLayout>
  );
}
