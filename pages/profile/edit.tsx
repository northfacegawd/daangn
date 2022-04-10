import type { NextPage } from "next";
import Button from "@components/common/button";
import Input from "@components/common/input";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EditProfileForm {
  email?: string;
  phone?: string;
  formErrors?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>({
    mode: "onBlur",
  });

  const onValid = ({ email, phone }: EditProfileForm) => {
    if (!email && !phone) {
      setError("formErrors", {
        message: "이메일, 전화번호 중 하나는 필수로 입력해야 합니다.",
      });
    }
  };

  useEffect(() => {
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  return (
    <form className="pt-4 px-4 space-y-4" onSubmit={handleSubmit(onValid)}>
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-slate-500" />
        <label
          htmlFor="picture"
          className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
        >
          Change
          <input id="picture" type="file" className="hidden" accept="image/*" />
        </label>
      </div>
      <Input
        register={register("email")}
        label="Email address"
        name="email"
        type="email"
        error={Boolean(errors.formErrors)}
      />
      <Input
        register={register("phone")}
        label="Phone number"
        name="phone"
        type="number"
        kind="phone"
        error={Boolean(errors.formErrors)}
      />
      {errors.formErrors ? (
        <span className="my-2 text-red-600 font-bold block text-sm text-center">
          {errors.formErrors.message}
        </span>
      ) : null}
      <Button text="Update profile" />
    </form>
  );
};

export default EditProfile;
