import React from "react";
import Link from "next/link";
import { classnames, footerHidden, hasSubUrl } from "../libs/utils";
import { useRouter } from "next/router";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const hidden = footerHidden(router.pathname);

  return (
    <div className="w-full max-w-xl mx-auto">
      <Header />
      <main className={classnames("pt-14", "pb-24")}>{children}</main>
      {!hidden && <Footer />}
    </div>
  );
}
