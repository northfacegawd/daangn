import type { NextPage } from "next";
import FloatingButton from "../components/common/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5 divide-y-[1px]">
      {[...Array(12)].map((_, i) => (
        <Item
          id={i}
          key={i}
          title="IPhone 14"
          price={99}
          comments={1}
          hearts={1}
        />
      ))}
      <FloatingButton href="/items/upload">
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
  );
};

export default Home;
