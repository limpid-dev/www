import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/Button";
import { TextField } from "@/components/Fields";
import { Logo } from "@/components/Logo";

export default function Verification() {
  const { query } = useRouter();

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form);
    console.log(data);
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
              Еще нет аккаунта?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Создайте
              </Link>{" "}
              бесплатно.
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Почтовый адрес"
            id="email"
            name="email"
            type="email"
            defaultValue={query.email}
            readOnly
            autoComplete="email"
            required
          />
          <TextField
            label="Код верфикации"
            id="token"
            name="token"
            type="text"
            autocomplete="one-time-code"
            required
          />
          <div>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              <span>Подтвердить</span>
            </Button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
