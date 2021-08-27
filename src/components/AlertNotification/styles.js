import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  alertMainText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    letterSpacing: -0.41,
    fontSize: 17
  },
  alertSubText: {
    color: "rgba(0, 0, 0, 0.48)",
    letterSpacing: -0.24,
    fontSize: 15,
    lineHeight: 20
  }
});
