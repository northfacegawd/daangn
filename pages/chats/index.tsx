import type { NextPage } from "next";
import Link from "next/link";

const Chats: NextPage = () => {
  return (
    <div className="divide-y-[1px] ">
      {[...Array(7)].map((_, i) => (
        <Link href={`/chats/${i}`} key={i}>
          <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-gray-700">Steve Jebs</p>
              <p className="text-sm  text-gray-500">
                See you tomorrow in the corner at 2pm!
              </p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Chats;
