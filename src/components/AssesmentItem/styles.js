import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    paddingRight: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.5,
    paddingTop: 15
  },
  heading: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black
  },
  subHeading: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 12,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.grey_shade_1
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    marginRight: 5,
    color: "rgba(0, 0, 0, 0.48)"
  }
});
