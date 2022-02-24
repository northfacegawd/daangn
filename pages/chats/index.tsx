import type { NextPage } from "next";

const Chats: NextPage = () => {
  return (
    <div className="py-10 divide-y-[1px]">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="flex cursor-pointer py-3 placeholder:items-center space-x-3 px-4"
        >
          <div className="w-12 h-12 rounded-full bg-slate-300" />
          <div className="flex flex-col justify-center">
            <p className="text-gray-700">Steve Jebs</p>
            <p className="text-sm text-gray-500">
              See you tomorrow in the corner at 2pm!
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
