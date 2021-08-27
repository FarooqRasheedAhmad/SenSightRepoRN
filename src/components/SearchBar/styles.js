import { Platform, StyleSheet } from "react-native";

import { theme } from "../../theme";

export const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "rgba(142, 142, 147, 0.12)",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    marginLeft: 5,
    height: Platform.OS === "ios" ? 40 : undefined,
  },
});
