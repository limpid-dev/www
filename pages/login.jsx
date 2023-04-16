import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";
import { Logo } from "../components/Logo";

export default function Login() {
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());

    await api.session.store({
      ...values,
      mode: "web",
    });

    await router.push({
      pathname: "/",
    });
  };

  return (
    <>
      <Head>
        <title>Sign In - TaxPal</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-20">
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
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Электронная почта"
            id="email"
            name="email"
            type="email"
            defaultValue={router.query.email}
            autoComplete="email"
            required
          />
          <TextField
            label="Пароль"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <div>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              Войти
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
