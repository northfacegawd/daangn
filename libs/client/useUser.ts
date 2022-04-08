import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserUserSWR {
  profile: User;
  ok: boolean;
}

// SWR - stale-while-revalidate, SWR은 먼저 캐시(스태일)로부터 데이터를 반환한 후, fetch 요청(재검증)을 하고, 최종적으로 최신화된 데이터를 가져오는 전략입니다.
// https://swr.vercel.app/ko
/*
    useSWR은 super cache를 이용하여 캐싱을 하기 때문에 
    useUser 훅을 각 컴포넌트에서 매번 사용하더라도 api요청을 매번 보내지 않음.
    useSWR 에서 api url은 url및 key로 사용됨.
*/
export default function useUser() {
  const { data, error } = useSWR<UserUserSWR>("/api/users/me");
  const router = useRouter();

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
