import RNFirebase from "react-native-firebase";

const configurationOptions = {
  debug: true,
  promptOnMissingPlayServices: true
};

export const firebase = RNFirebase.initializeApp(configurationOptions);
