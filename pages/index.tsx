import type { NextPage } from "next";
import FloatingButton from "@components/common/floating-button";
import Product from "@components/product";
import Head from "next/head";
import useSWR from "swr";
import type { Product as P } from "@prisma/client";

export interface ProductWithCount extends P {
  _count: {
    favs: number;
  };
}
interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
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
            image={product.image}
            comments={1}
            hearts={product._count.favs}
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
