import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  contentRoot: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  contentSub: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    letterSpacing: -0.41,
    fontSize: 17,
    lineHeight: 22,
  },
  taskDate: {
    color: theme.colors.black,
    letterSpacing: -0.24,
    fontSize: 15,
    lineHeight: 20,
  },
  overdueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  overdueText: {
    color: theme.colors.red_shade_1,
    marginRight: 3,

    fontFamily: theme.fonts.SFProRegular,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.208,
  },
});
