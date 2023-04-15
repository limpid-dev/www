import Link from "next/link";
import { useRouter } from "next/router";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { TextField } from "../components/Fields";

export default function Login() {
  const { email } = useRouter().query;

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-zinc-900">
          Подтвердите вашу электронную почту
        </h2>
        <p className="mt-2 text-sm text-zinc-700">
          Еще нет аккаунта?{" "}
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
        <input type="email" value={email} name="email" hidden />
        <TextField
          label="Код"
          type="text"
          minLength={6}
          required
          className="font-mono"
        />
        <Button type="submit" variant="solid" color="blue" className="w-full">
          Подтвердить
        </Button>
      </form>
    </AuthLayout>
  );
}
