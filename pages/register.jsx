import Link from "next/link";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";

export default function Register() {
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-zinc-900">
          Начните бесплатно
        </h2>
        <p className="mt-2 text-sm text-zinc-700">
          Уже зарегистрированы?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-600 hover:underline"
          >
            Войдите
          </Link>{" "}
          в свой аккаунт.
        </p>
      </div>
      <form
        action="#"
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >
        <TextField label="Фамилия" type="text" required />
        <TextField label="Имя" type="text" required />
        <TextField
          className="col-span-full"
          label="Электронная почта"
          type="email"
          required
        />
        <TextField
          className="col-span-full"
          label="Пароль"
          type="password"
          required
        />
        <Button
          type="submit"
          variant="solid"
          color="emerald"
          className="col-span-full"
        >
          Создать
        </Button>
      </form>
    </AuthLayout>
  );
}
