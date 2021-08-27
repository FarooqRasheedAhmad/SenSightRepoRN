import { useCallback, useState } from "react";

import { AppConstants, StorageUtils } from "../utils";

export const usePost = ({ url, type = "post", body, options }) => {
  const [response, setResponse] = useState({
    data: null,
    error: null,
    loading: false
  });

  // You POST method here
  const callAPI = useCallback(async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    setResponse(prevState => ({ ...prevState, loading: true }));

    try {
      const res = await fetch(url, {
        method: type,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body,
        ...options
      });
      if (res) {
        const json = await res.json();
        setResponse({ data: json, loading: false, error: null });
      }
    } catch (error) {
      setResponse({ data: null, loading: null, error });
    }
  }, [url, type, body, options]);
  return [response, callAPI];
};
