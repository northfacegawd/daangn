import axios from "axios";
import { useCallback, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export default function useMutation<T = any>(
  url: string
): [
  (body: any) => Promise<void>,
  { loading: boolean; data: T | null; error: any }
] {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: false,
    error: null,
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
