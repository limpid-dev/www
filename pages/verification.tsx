import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import api from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { TextField } from "../components/Fields";
import { Logo } from "../components/Logo";
import { Button } from "../components/Primitives/Button";
import { Field, Form, Input, Label } from "../components/Primitives/Form";

export default function Verification() {
  const router = useRouter();

  const sendVerificationEmail = async () => {
    if (typeof router.query.email !== "string") return;

    await api.verification.store({
      email: router.query.email,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form) as Record<string, string>;

    if (typeof router.query.email !== "string") return;

    await api.verification.update({
      email: router.query.email,
      token: values.token,
    });

    await router.push({
      pathname: "/login",
      query: { email: router.query.email },
    });
  };

  return (
    <>
      <Head>
        <title>Подтверждение аккаунта</title>
      </Head>
      <AuthLayout>
        <h2 className="text-lg font-semibold text-zinc-900">
          Подтвердите свой аккаунт
        </h2>
        <p className="mt-2 text-sm text-zinc-700">
          Мы отправили вам письмо с кодом подтверждения на{" "}
          <span className="text-sm font-semibold text-zinc-700">
            {router.query.email}
          </span>
        </p>
        <Form onSubmit={onSubmit} className="mt-10">
          <Field name="token">
            <Label>Код подтверждения</Label>
            <Input
              name="token"
              type="text"
              autoComplete="one-time-code"
              required
            />
          </Field>
          <div className="space-y-4">
            <Button
              type="submit"
              variant="solid"
              color="lime"
              className="w-full"
            >
              Подтвердить
            </Button>
            <Button
              onClick={sendVerificationEmail}
              variant="outline"
              color="zinc"
              type="reset"
              className="w-full"
            >
              Отправить заново
            </Button>
          </div>
        </Form>
      </AuthLayout>
    </>
  );
}
