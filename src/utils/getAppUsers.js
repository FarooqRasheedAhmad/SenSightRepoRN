import { AppConstants } from "./AppConstants";
import { StorageUtils } from "./StorageUtils";
import { careHomesUsers, senSightsUsers } from "./constants";
// import { AppConstants, StorageUtils, careHomesUsers, senSightsUsers } from "./";



export const getAppUsers = async (cb) => {
  const type = await StorageUtils.getValue(AppConstants.SP.APP_TYPE);
  if (type == "1") {
    cb(senSightsUsers, type);
  } else if (type == "2") {
    cb(careHomesUsers, type);
  } else {
    cb(senSightsUsers, "1");
  }
};
