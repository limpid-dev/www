import Link from "next/link";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900">
          Войдите в свой аккаунт
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Создайте аккаунт
          </Link>{" "}
          бесплатно.
        </p>
      </div>
      <form action="#" className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField label="Электронная почта" type="email" required />
        <TextField label="Пароль" type="password" required />
        <Button type="submit" variant="solid" color="blue" className="w-full">
          <span>
            Войти <span aria-hidden="true">&rarr;</span>
          </span>
        </Button>
      </form>
    </AuthLayout>
  );
}
