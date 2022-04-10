import type { NextPage } from "next";
import ProductList from "@components/common/product-list";

const Sold: NextPage = () => {
  return (
    <div className="flex px-4 flex-col space-y-5 divide-y-[1px]">
      <ProductList kind="sales" />
    </div>
  );
};

export default Sold;
