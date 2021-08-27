import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey_shade_3,
    marginLeft: 12,
    padding: 10,
  },
  listSubText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.grey_shade_1,
  },
  listText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black
  },
  rightText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: theme.colors.black,
    marginRight: 10
  }
});
