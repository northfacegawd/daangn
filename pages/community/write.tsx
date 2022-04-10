import type { NextPage } from "next";
import Button from "@components/common/button";
import TextArea from "@components/common/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>({ mode: "onBlur" });
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");

  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
      <TextArea
        register={register("question", { required: true, minLength: 5 })}
        required
        placeholder="Answer a question!"
      />
      <Button
        disabled={loading}
        text={loading ? "Loading..." : "Submit"}
        type="submit"
      />
    </form>
  );
};

export default Write;
