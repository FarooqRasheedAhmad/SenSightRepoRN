import React, { useEffect, useState } from "react";

import { LocationItem } from "../LocationItem";
import { watchPaired as checkDevice } from "../../utils/watchPaired";
import { icons } from "../../assets";

export const App = (props) => {
  const [watchPaired, setWatchPaired] = useState(false);
  const [watchTitle, setWatchTitle] = useState("Apple Watch");

  useEffect(() => {
    checkWatch();
  });

  const checkWatch = () => {
    checkDevice((data, error) => {
      if (data) {
        setWatchPaired(data.watchPaired);
        setWatchTitle(data.title);
      }
    });
  };
  return (
    <LocationItem
      name={
        watchPaired && watchTitle !== "Android Watch" ? watchTitle : "Apps"
      }
      detail={
        watchPaired && watchTitle !== "Android Watch" ? watchPaired : undefined
      }
      leftIcon={icons.apps}
      onPress={() =>
        props.navigation.navigate("Apps", {
          seniorId: props.seniorId,
          watchPaired,
          watchTitle,
        })
      }
    />
    
  );
};
