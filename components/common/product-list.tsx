import Item from "@components/product";
import { ProductWithCount } from "pages";
import useSWR from "swr";

export type ProductType = "sales" | "purchases" | "favs";

interface ProductRecord {
  id: number;
  product: ProductWithCount;
}

interface ProductListProps {
  kind: ProductType;
}

export type ProductsResponse = Record<ProductType, ProductRecord[]> &
  Record<"ok", boolean>;

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductsResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind].map((item) => (
        <Item
          id={item.product.id}
          key={item.id}
          title={item.product.name}
          price={item.product.price}
          comments={1}
          hearts={item.product._count.favs}
        />
      ))}
    </>
  ) : null;
}
