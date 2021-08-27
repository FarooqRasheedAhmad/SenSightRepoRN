import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  avatar: { height: 40, width: 40, borderRadius: 20 },
  time: {
    fontSize: 16,
    fontFamily: theme.fonts.SFProSemibold,
    color: theme.colors.grey_shade_1
  },
  description: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16
  },
  root: {
    flexGrow: 1,
    flexDirection: "row",
    padding: 8
  },
  left: { padding: 8, alignSelf: "center" },
  title: { fontFamily: theme.fonts.SFProSemibold, fontSize: 18 },
  right: { padding: 8, flexDirection: "row" },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  rightText: {
    color: theme.colors.grey_shade_1,
    fontSize: 18,
    fontFamily: theme.fonts.SFProRegular
  },
  rightImage: { marginLeft: 8, alignSelf: "center" }
});
