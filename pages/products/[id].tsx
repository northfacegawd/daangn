import type { GetServerSideProps, NextPage } from "next";
import Button from "@components/common/button";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Product } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { classnames, getImageUrl } from "@libs/client/utils";
import { useCallback } from "react";
import useUser from "@libs/client/useUser";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}
interface ProductResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
  const { data, mutate } = useSWR<ProductResponse>(
    id ? `/api/products/${id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${id}/fav`);

  const onFavClick = useCallback(() => {
    if (!data) return;
    mutate({ ...data, isLiked: !data.isLiked }, false);
    toggleFav({});
  }, [data, mutate, toggleFav]);

  return (
    <div className="px-4 py-4">
      <div className="mb-8">
        {data?.product.image ? (
          <div className="relative pb-80">
            <Image
              src={getImageUrl(data.product.image)}
              className="bg-slate-300 object-contain"
              alt="product"
              layout="fill"
            />
          </div>
        ) : (
          <div className="h-96 bg-slate-300" />
        )}
        <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
          {user?.avatar ? (
            <Image
              src={getImageUrl(user.avatar, "avatar")}
              className="w-12 h-12 rounded-full bg-slate-300"
              width={48}
              height={48}
              alt="avatar"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.product.user?.name}
            </p>
            <Link href={`/users/profiles/${data?.product.user?.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.product.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.product.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.product.description}</p>
          <div className="flex items-center justify-between space-x-2">
            <Button large text="Talk to seller" />
            <button
              onClick={onFavClick}
              title="like"
              className={classnames(
                "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                data?.isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-gray-500"
              )}
            >
              {data?.isLiked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 "
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
        <div className=" mt-6 grid grid-cols-2 gap-4">
          {data?.relatedProducts?.map((relatedProduct) => (
            <Link
              href={`/products/${relatedProduct.id}`}
              key={relatedProduct.id}
            >
              <a>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{relatedProduct.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  {relatedProduct.price}
                </span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
