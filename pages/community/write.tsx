import type { NextPage } from "next";
import Button from "@components/common/button";
import TextArea from "@components/common/textarea";

const Write: NextPage = () => {
  return (
    <form className="p-4 space-y-4">
      <TextArea required placeholder="Answer a question!" />
      <Button text="Submit" type="submit" />
    </form>
  );
};

export default Write;
