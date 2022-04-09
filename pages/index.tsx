import type { NextPage } from "next";
import FloatingButton from "@components/common/floating-button";
import Product from "@components/product";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import type { Product as P } from "@prisma/client";

interface ProductResponse {
  ok: boolean;
  products: P[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductResponse>("/api/products");

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y-[1px]">
        {data?.products.map((product) => (
          <Product
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={1}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </>
  );
};

export default Home;
