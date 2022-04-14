import type { NextPage } from "next";
import Button from "@components/common/button";
import Input from "@components/common/input";
import TextArea from "@components/common/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import React, { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { classnames } from "@libs/client/utils";
import axios from "axios";
import { CloudflareUploadResponse, FilesResponse } from "pages/profile/edit";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const { register, handleSubmit, watch } = useForm<UploadProductForm>({
    mode: "onBlur",
  });
  const [photoPreview, setPhotoPreview] = useState<string>();
  const photo = watch("photo");

  useEffect(() => {
    if (photo?.item(0)) {
      const file = photo.item(0)!;
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  const onValid = async ({
    name,
    description,
    photo,
    price,
  }: UploadProductForm) => {
    if (loading) return;
    if (photo?.item(0)) {
      // ask for Cloudflare URL
      const {
        data: { uploadURL },
      } = await axios.get<FilesResponse>("/api/files");

      // upload file to Cloudflare URL
      const form = new FormData();
      form.append("file", photo.item(0)!, new Date().toISOString());
      const {
        result: { id },
      }: CloudflareUploadResponse = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      uploadProduct({ name, description, price, photoId: id });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <form
      className="p-4 space-y-4"
      autoComplete="off"
      onSubmit={handleSubmit(onValid)}
    >
      <div>
        <label
          htmlFor="image"
          className={classnames(
            "w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md",
            photoPreview ? "aspect-video" : ""
          )}
          style={{
            backgroundImage: `url(${photoPreview})`,
            background: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {!photoPreview && (
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <input
            {...register("photo")}
            title="image"
            id="image"
            className="hidden"
            type="file"
            accept="image/*"
          />
        </label>
      </div>
      <Input
        register={register("name", { required: true })}
        label="Name"
        name="name"
        type="text"
      />
      <Input
        register={register("price", {
          required: true,
          valueAsNumber: true,
        })}
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
      <Button text={loading ? "Uploading..." : "Upload item"} />
    </form>
  );
};

export default Upload;
