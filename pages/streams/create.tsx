import type { NextPage } from "next";
import Button from "@components/common/button";
import Input from "@components/common/input";
import TextArea from "@components/common/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>("/api/streams");
  const { register, handleSubmit } = useForm<CreateForm>({ mode: "onBlur" });

  const onValid = (data: CreateForm) => {
    if (loading) return;
    createStream(data);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4 pt-4 px-4">
      <Input
        register={register("name", { required: true })}
        required
        label="Name"
        name="name"
        type="text"
      />
      <Input
        register={register("price", { required: true })}
        required
        label="Price"
        placeholder="0.00"
        name="price"
        type="text"
        kind="price"
      />
      <TextArea
        register={register("description", { required: true })}
        name="description"
        label="Description"
      />
      <Button disabled={loading} text={loading ? "Loading..." : "Go streams"} />
    </form>
  );
};

export default Create;
