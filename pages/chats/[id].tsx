import type { NextPage } from "next";
import React from "react";

const ChatDetail: NextPage = () => {
  return (
    <div className="px-4 pt-4 space-y-4">
      {[...Array(10)].map((i) => (
        <React.Fragment key={i}>
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-400" />
            <div className="w-1/2 text-sm text-gray-700 p-2 border rounded-md border-gray-300">
              <p>Hi how much are you selling them for?</p>
            </div>
          </div>
          <div className="flex flex-row-reverse items-start space-x-2 space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-400" />
            <div className="w-1/2 text-sm text-gray-700 p-2 border rounded-md border-gray-300">
              <p>I want ￦20,000</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-400" />
            <div className="w-1/2 text-sm text-gray-700 p-2 border rounded-md border-gray-300">
              <p>미쳤어</p>
            </div>
          </div>
        </React.Fragment>
      ))}
      <div className="fixed w-full mx-auto max-w-md bottom-1.5 inset-x-0">
        <div className="flex relative items-center">
          <input
            title="message"
            type="text"
            className="shadow-sm rounded-full w-full pr-12 border-gray-300 focus:ring-orange-500 focus:outline-none focus:border-orange-500"
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex items-center bg-orange-500 rounded-full px-2 pb-2 text-2xl text-white hover:bg-orange-600 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
