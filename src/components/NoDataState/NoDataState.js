import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const NoDataState = ({ text, style, children }) => (
  <View style={{ ...styles.root, ...(style ? style : {}) }}>
    {text && <Text>{text}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});
