import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../api";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";
import { Logo } from "../components/Logo";

export default function Register() {
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());

    const [firstName, lastName] = values.fullName.trim().split(" ");

    const { data } = await api.users.store({
      firstName,
      lastName,
      email: values.email,
      password: values.password,
    });

    await router.push({
      pathname: "/verification",
      query: { email: data.email },
    });
  };

  return (
    <>
      <Head>
        <title>Limpid - Регистрация</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Начните бесплатно
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Войдите
              </Link>{" "}
              в ваш аккаунт.
            </p>
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
        >
          <TextField
            className="col-span-full"
            label="Полное имя"
            name="fullName"
            type="text"
            pattern="^[a-zA-Z]+ [a-zA-Z]+$"
            autoComplete="name"
            required
          />
          <TextField
            className="col-span-full"
            label="Электронная почта"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="Пароль"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <div className="col-span-full">
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
