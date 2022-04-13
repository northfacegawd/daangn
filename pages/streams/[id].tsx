import type { NextPage } from "next";
import React, { useEffect } from "react";
import Message from "@components/common/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import type { Message as M, Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { classnames, getImageUrl } from "@libs/client/utils";
import useUser from "@libs/client/useUser";

interface MessageWithUser extends M {
  user: {
    id: number;
    avatar: string | null;
  };
}
interface StreamWithMessage extends Stream {
  messages: MessageWithUser[];
}
interface StreamResponse {
  ok: true;
  stream: StreamWithMessage;
}
interface MessageForm {
  message: string;
}

interface MessageResponse {
  ok: boolean;
  message: M;
}

const Stream: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<MessageForm>({
    mode: "onBlur",
  });
  const { id } = router.query;
  /*
    NextJS, api, page만 이용해서 실시간 처리를 할 수 없음.
    실시간 처리를 위한 설정을 하기 전에 실시간으로 채팅을 하는 것 처럼 보이기 위한
    api 재요청 주기를 1초로 주고 채팅 데이터를 mutate함.
  */
  const { data, mutate } = useSWR<StreamResponse>(
    id ? `/api/streams/${id}` : null,
    { refreshInterval: 1000 }
  );
  const [sendMessage, { loading, data: messageData }] =
    useMutation<MessageResponse>(`/api/streams/${id}/messages`);

  const onValid = (data: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: data.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
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
          {data?.stream.messages.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              reversed={message.user.id === user?.id}
              avatarUrl={
                message.user.avatar
                  ? getImageUrl(message.user.avatar, "avatar")
                  : undefined
              }
            />
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
