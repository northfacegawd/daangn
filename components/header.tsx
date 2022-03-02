import { useRouter } from "next/router";
import { classnames, getTitle, hasSubUrl } from "../libs/client/utils";

export default function Header() {
  const router = useRouter();

  const onClickToBack = () => router.back();

  const nested = hasSubUrl(router.pathname);

  return (
    <header className="bg-white w-full h-12 max-w-xl justify-center text-lg px-10 font-medium  fixed text-gray-800 border-b top-0  flex items-center">
      {nested ? (
        <button
          onClick={onClickToBack}
          title="goBack"
          className="absolute left-4"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      ) : (
        <span className={classnames(nested ? "mx-auto" : "")}>
          {getTitle(router.pathname)}
        </span>
      )}
    </header>
  );
}
