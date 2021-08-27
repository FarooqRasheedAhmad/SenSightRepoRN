import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  ignoreView: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  ignoreText: {
    color: Platform.OS === "ios" ? "#007ff9" : "#169689",
    fontSize: 18,
  },
});
