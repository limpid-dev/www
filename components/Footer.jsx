import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

export function Footer() {
  return (
    <footer className="bg-zinc-50">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">Возможности</NavLink>
              <NavLink href="#testimonials">Отзывы</NavLink>
              <NavLink href="#pricing">Цены</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-zinc-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link
              href="https://www.facebook.com/limpid.kz"
              className="group"
              aria-label="TaxPal on Twitter"
            >
              <FacebookLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.tiktok.com/@lim_eurasian?_t=8Wi9zh8TNiA&_r=1"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <TiktokLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.instagram.com/limpid.kz/"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <InstagramLogo className="h-8 w-8" />
            </Link>
            <Link
              href="https://www.youtube.com/@limeurasian2409"
              className="group"
              aria-label="TaxPal on GitHub"
            >
              <YoutubeLogo className="h-8 w-8" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} Limpid. Все права
            защищены. <br /> Республика Казахстан, город Астана, улица Шолпан
            Иманбаева, 5В
            <br />
            Бин: 210740020835
          </p>
        </div>
      </Container>
    </footer>
  );
}
