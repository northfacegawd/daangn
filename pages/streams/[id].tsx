import type { NextPage } from "next";
import React from "react";
import Message from "@components/common/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { classnames } from "@libs/client/utils";

interface StreamResponse {
  ok: true;
  stream: Stream;
}

interface MessageForm {
  message: string;
}

const Stream: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>({
    mode: "onBlur",
  });
  const { id } = router.query;
  const { data } = useSWR<StreamResponse>(id ? `/api/streams/${id}` : null);
  const [sendMessage, { loading, data: messageData }] = useMutation(
    `/api/streams/${id}/messages`
  );

  const onValid = (data: MessageForm) => {
    if (loading) return;
    reset();
    sendMessage(data);
  };

  return (
    <div className="py-10 px-4  space-y-4">
      <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
      <div className="mt-5">
        <h1 className="text-3xl font-bold text-gray-900">
          {data?.stream.name}
        </h1>
        <span className="text-2xl block mt-3 text-gray-900">
          {data?.stream.price}원
        </span>
        <p className=" my-6 text-gray-700">{data?.stream.description}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
        <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <Message message="Hi how much are you selling them for?" />
              <Message message="I want ￦20,000" reversed />
              <Message message="미쳤어" />
            </React.Fragment>
          ))}
        </div>

        <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex relative max-w-md items-center  w-full mx-auto"
          >
            <input
              title="message"
              type="text"
              {...register("message", { required: true })}
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button
                className={classnames(
                  "flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white",
                  loading
                    ? "bg-orange-300 cursor-not-allowed hover:bg-orange-300"
                    : ""
                )}
              >
                &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Stream;
