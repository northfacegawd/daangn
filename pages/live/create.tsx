import type { NextPage } from "next";
import Button from "@components/common/button";
import Input from "@components/common/input";
import TextArea from "@components/common/textarea";

const Create: NextPage = () => {
  return (
    <form className="space-y-4 pt-4 px-4">
      <Input required label="Name" name="name" type="text" />
      <Input
        required
        label="Price"
        placeholder="0.00"
        name="price"
        type="text"
        kind="price"
      />
      <TextArea name="description" label="Description" />
      <Button text="Go live" />
    </form>
  );
};

export default Create;
