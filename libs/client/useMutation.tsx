import axios from "axios";
import { useCallback, useState } from "react";

interface UserMutationState<T> {
  loading: boolean;
  data?: T;
  error?: any;
}

type UseMutationResult<T> = [
  (body: any) => Promise<void>,
  UserMutationState<T>
];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setState] = useState<UserMutationState<T>>({
    loading: false,
  });

  const mutation = useCallback(
    async (body: any) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const { data } = await axios.post<T>(url, body);
        setState((prev) => ({ ...prev, data }));
      } catch (error) {
        setState((prev) => ({ ...prev, error }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [url]
  );
  return [mutation, state];
}
