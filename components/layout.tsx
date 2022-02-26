import React from "react";
import Link from "next/link";
import { classnames } from "../libs/utils";
import { useRouter } from "next/router";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Header title={title} canGoBack={canGoBack} />
      <main className={classnames("pt-14", hasTabBar ? "pb-24" : "")}>
        {children}
      </main>
      <Footer />
    </>
  );
}
