import React, { useEffect, useState } from "react";

import { AppConstants, StorageUtils } from "../../utils";

export const Resource = props => {
  const { type, apiUrl, body, children, resourceOnClick } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!resourceOnClick) {
      post();
    }
  }, []);

  const post = async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    setLoading(true);
    fetch(apiUrl, {
      method: type,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: body ? JSON.stringify(body) : undefined
    })
      .then(response => {
        if (!response.ok) {
          setLoading(false);
          setError(response.statusText);
          return;
        }
        console.log("Posssssssssting======response=========", response);
        return response.json();
      })
      .catch(onrejected => {
        setLoading(false);
        setError(onrejected);
        console.log("Posssssssssting======onrej=========", onrejected);
      })
      .then(res => {
        setError(null);
        setLoading(false);
        setData(res);
        console.log("Posssssssssting======res=========", res);
      })
      .catch(error => {
        console.log("Posssssssssting========err=======", error);

        setError(error);
      });
    console.log("Posssssssssting===============", error, loading, data);
  };

  return children({ loading, error, data }, post);
};
