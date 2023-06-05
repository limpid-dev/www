import "../tailwind.css";
import { Field } from "@radix-ui/react-form";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { FormEvent, useEffect, useState } from "react";
import api from "../api";
import { Entity } from "../api/users";
import { Button } from "../components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/primitives/dialog";
import { Form } from "../components/primitives/form";
import { Input } from "../components/primitives/input";
import { Label } from "../components/primitives/label";
import { Toaster } from "../components/primitives/toaster";

function App({ Component, pageProps }: AppProps) {
  const [verification, setVerification] = useState(false);
  const [session, setSession] = useState<Entity>();
  // useEffect(() => {
  //   async function fetchProfiles() {
  //     const { data } = await api.session.show();
  //     if (data) {
  //       setSession(data);
  //     }
  //     if (data?.email_verified_at === null) {
  //       setVerification(true);
  //     }
  //   }
  //   fetchProfiles();
  // }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form) as Record<string, string>;

    await api.verification.update({
      token: values.token,
    });

    setVerification(false);
  };

  const sendVerificationEmail = async () => {
    await api.verification.store();
  };

  return (
    <div className="min-h-full">
      <Head>
        <title>LIM - все для людей</title>
      </Head>
      <Component {...pageProps} />
      {/* <Script defer data-domain="limpid.kz" src="/js/script.js" /> */}
      <Dialog open={verification} onOpenChange={setVerification}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px] p-10">
          <DialogHeader>
            <DialogTitle>Подтвердите свой аккаунт.</DialogTitle>
            <DialogDescription>
              Мы отправили вам письмо с кодом подтверждения на{" "}
              <span className=" text-black">{session?.email}</span>
            </DialogDescription>
          </DialogHeader>
          <Form onSubmit={onSubmit} className="">
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
              <Button type="submit" color="lime" className="w-full">
                Подтвердить
              </Button>
              <Button
                onClick={sendVerificationEmail}
                variant="outline"
                type="reset"
                className="w-full"
              >
                Отправить заново
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}

export default appWithTranslation(App);
