import type { NextPage } from "next";
import Item from "@components/product";
import ProductList from "@components/common/product-list";

const Bought: NextPage = () => {
  return (
    <div className="flex px-4 flex-col space-y-5 divide-y-[1px]">
      <ProductList kind="purchases" />
    </div>
  );
};

export default Bought;
