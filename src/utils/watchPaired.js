import { AppConstants } from "./AppConstants";
import { Platform } from "react-native";
import { StorageUtils } from "./StorageUtils";
import { api } from "../api";
// import { showMessage } from "./showMessage";

export const watchPaired = async (cb, timeDuration) => {
  const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
  const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
  const seniorId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

  const url = `${api.isWatchPaired}/${seniorId}${
    timeDuration ? `?timeDuration=${timeDuration}` : ""
  }`;
  
  if (role === "senior") {
    try {
      const response = await fetch(url, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response) {
        if (response.ok) {
          const json = await response.json();
          if (Platform.OS === "ios") {
            Watch.getIsPaired((err, isPaired) => {
              cb(
                {
                  watchPaired: json,
                  title: isPaired
                    ? "Apple Watch"
                    : json
                    ? "Android Watch"
                    : "Apple Watch",
                },
                null
              );
            });
          } else {
            cb({ watchPaired: json, title: "Android Watch" }, null);
          }
        } else {
          cb(null, { message: "Error in getting watch status" });
        }
      }
    } catch (error) {
      cb(null, error);
    }
  }

};
