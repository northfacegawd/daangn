import type { NextPage } from "next";
import Button from "@components/common/button";
import Input from "@components/common/input";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import axios from "axios";
import { getImageUrl } from "@libs/client/utils";

interface EditProfileForm {
  name: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
  errorField?: "email" | "phone";
}

export interface FilesResponse {
  ok: boolean;
  id: string;
  uploadURL: string;
}

export interface CloudflareUploadResponse {
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  result_info: any;
  success: boolean;
  errors: any[];
  messages: any[];
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>({
    mode: "onBlur",
  });
  const [editProfile, { data, loading, error }] =
    useMutation<EditProfileResponse>("/api/users/me");
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const avatar = watch("avatar");

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (!email && !phone) {
      return setError("formErrors", {
        message: "이메일, 전화번호 중 하나는 필수로 입력해야 합니다.",
      });
    }
    if (avatar?.item(0) && user) {
      // ask for Cloudflare URL
      const {
        data: { uploadURL },
      } = await axios.get<FilesResponse>("/api/files");

      // upload file to Cloudflare URL
      const form = new FormData();
      form.append("file", avatar.item(0)!, user.id.toString());
      const {
        result: { id },
      }: CloudflareUploadResponse = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    }
    editProfile({ email, phone, name });
  };

  useEffect(() => {
    if (avatar && avatar.item(0)) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.avatar) setAvatarPreview(getImageUrl(user.avatar, "avatar"));
  }, [user, setValue]);

  useEffect(() => {
    if (error && error.response?.data) {
      if (error.response?.data?.errorField === "email") {
        setError("email", { message: "현재 사용중인 이메일 입니다." });
      }
      if (error.response?.data?.errorField === "phone") {
        setError("phone", { message: "현재 사용중인 전화번호 입니다." });
      }
    }
  }, [setError, error]);

  return (
    <form className="pt-4 px-4 space-y-4" onSubmit={handleSubmit(onValid)}>
      <div className="flex items-center space-x-3">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            className="w-14 h-14 rounded-full bg-slate-500"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-500" />
        )}

        <label
          htmlFor="picture"
          className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
        >
          Change
          <input
            {...register("avatar")}
            id="picture"
            type="file"
            className="hidden"
            accept="image/*"
            multiple={false}
          />
        </label>
      </div>
      <Input
        register={register("name", {
          required: { message: "이름은 비워둘 수 없습니다.", value: true },
        })}
        label="Username"
        name="name"
        type="text"
        error={Boolean(errors.formErrors || errors.name)}
      />
      {errors.name && (
        <span className="text-red-600 font-bold block text-sm">
          {errors.name.message}
        </span>
      )}
      <Input
        register={register("email")}
        label="Email address"
        name="email"
        type="email"
        error={Boolean(errors.formErrors || errors.email)}
      />
      {errors.email && (
        <span className="text-red-600 font-bold block text-sm">
          {errors.email.message}
        </span>
      )}
      <Input
        register={register("phone")}
        label="Phone number"
        name="phone"
        type="number"
        kind="phone"
        error={Boolean(errors.formErrors || errors.phone)}
      />
      {errors.phone && (
        <span className="text-red-600 font-bold block text-sm">
          {errors.phone.message}
        </span>
      )}
      {errors.formErrors && (
        <span className="my-2 text-red-600 font-bold block text-sm text-center">
          {errors.formErrors.message}
        </span>
      )}
      <Button
        disabled={loading}
        text={loading ? "Loading..." : "Update profile"}
      />
    </form>
  );
};

export default EditProfile;
