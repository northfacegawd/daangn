import type { NextPage } from "next";
import React from "react";
import Message from "../../components/common/message";

const ChatDetail: NextPage = () => {
  return (
    <div className="px-4 pt-4 space-y-4">
      {[...Array(10)].map((i) => (
        <React.Fragment key={i}>
          <Message message="Hi how much are you selling them for?" />
          <Message message="I want ￦20,000" reversed />
          <Message message="미쳤어" />
        </React.Fragment>
      ))}
      <form className="fixed py-2 bg-white bottom-0 inset-x-0">
        <div className="flex relative max-w-md items-center w-full mx-auto">
          <input
            title="message"
            type="text"
            className="mx-1 shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex items-center bg-orange-500 rounded-full mr-1 px-2 pb-2 text-2xl text-white hover:bg-orange-600 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              &rarr;
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatDetail;
