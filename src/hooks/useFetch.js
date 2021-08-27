import { AppConstants, StorageUtils } from "../utils";
import { useEffect, useState } from "react";

export const useFetch = (url, type = "get", body, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const controller = new AbortController();
  const { signal } = controller;


  // useEffect(() => {
  //   return () => {
  //     if (loading){
  //       console.log("================== ABORT");
  //       abort();
  //     }
  //   }
  // }, [url]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // console.log("url: ", url);

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    setLoading(true);
    // console.log("loading: true");

    try {
      const res = await fetch(url, {
        signal,
        method: type,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body,
        ...options,
      });
      if (res) {
        const json = await res.json();
        setData(json);
        setLoading(false);
        setError(null);
        // console.log("loading: false", "\JSON Data: ", json);
      }
    } catch (_error) {
      // console.log("error: ", _error);
      setLoading(false);
      setError(_error);
    }

  };

  const abort = async () => {
    // console.log("abort()");
    await controller.abort();
    setData(null);
    setError(null)
    setLoading(false)
    return;
  }

  return { data, error, loading, fetchData, abort };
};
