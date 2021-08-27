import AsyncStorage from "@react-native-community/async-storage";
import { cond } from "lodash";
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

const encryptionaArr = ["userId", "firstName", "lastName", "address", "email", "phone", "profileImage", "profileDescription", 'country', 'companyId',]

export class StorageUtils {
  static storeInStorage = async (key, value) => {
    try {
      if (encryptionaArr.indexOf(key) !== -1) {
        await RNSecureStorage.set(key, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED })
      } else {
        await AsyncStorage.setItem(key, value);
      }
      return true;
    } catch (e) {
      console.error(`ERROR updating storage: ${key}: `, e);
    }
  };

  static remove = async (key) => {
    try {
      if (encryptionaArr.indexOf(key) !== -1) {
        await RNSecureStorage.remove(key)
      } else {
        await AsyncStorage.removeItem(key)
      }
    } catch (e) {
      console.error(`ERROR removing storage: ${key}: `, e);
    }
  }

  static removeAll = async (args) => {
    const keys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(keys);
    for (var i = 0; i < encryptionaArr.length - 1; i++) {
      await RNSecureStorage.remove(encryptionaArr[i])
    }
    return true;
  }

  static getValue = async key => {
    try {
      if (encryptionaArr.indexOf(key) !== -1) {
        var value = await RNSecureStorage.get("key1")
      } else {
        var value = await AsyncStorage.getItem(key);
      }
      if (value == null) value = ""
      return value;
    } catch (e) {
      console.error("getItem AsyncStorage: ", e);
    }
    return null;
  };

  static getMulti = async arr => {
    var result = await AsyncStorage.multiGet(arr);
    for (var i = 0; i < arr.length; i++) {
      if (encryptionaArr.indexOf(arr[i]) !== -1){
         const value = await RNSecureStorage.get(arr[i])
         result[i] = [arr[i],value]
      }
    }
    return result;
  };
}
