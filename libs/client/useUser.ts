import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<{ ok: boolean; profile: User }>(
          "/api/users/me"
        );
        setUser(data.profile);
      } catch (error) {
        console.log(error);
        return router.replace("/enter");
      }
    })();
  }, [router]);

  return user;
}
