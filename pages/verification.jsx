import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";
import { Logo } from "../components/Logo";

export default function Verification() {
  const router = useRouter();

  const sendVerificationEmail = async () => {
    await api.verification.store({
      email: router.query.email,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form);

    await api.verification.update({
      email: router.query.email,
      token: values.token,
    });

    await router.push({
      pathname: "/login",
      query: { email: values.email },
    });
  };

  return (
    <>
      <Head>
        <title>Подтверждение аккаунта</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Подтвердите свой аккаунт
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Мы отправили вам письмо с кодом подтверждения на{" "}
              <span className="text-sm font-semibold text-gray-700">
                {router.query.email}
              </span>
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Код подтверждения"
            id="token"
            name="token"
            type="text"
            autoComplete="one-time-code"
            required
          />
          <div className="space-y-4">
            <Button
              onClick={sendVerificationEmail}
              variant="outline"
              color="slate"
              type="reset"
              className="w-full"
            >
              Отправить заново
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              Подтвердить
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
