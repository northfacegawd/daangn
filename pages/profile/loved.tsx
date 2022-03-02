import type { NextPage } from "next";
import Item from "@components/item";

const Loved: NextPage = () => {
  return (
    <div className="flex px-4 flex-col space-y-5 divide-y-[1px]">
      {[...Array(12)].map((_, i) => (
        <Item
          key={i}
          id={i}
          title="iPhone 14"
          price={99}
          comments={1}
          hearts={1}
        />
      ))}
    </div>
  );
};

export default Loved;
