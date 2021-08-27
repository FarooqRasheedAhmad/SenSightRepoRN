import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexDirection: "row",
    padding: 8
  },
  left: {
    padding: 8,
    alignSelf: "center",
    backgroundColor: "#828282",
    borderRadius: 3,
    height: 32,
    width: 32,
    marginLeft: 8
  },
  title: {
    padding: 8,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 18
  },
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
