import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 10,
      height: 10
    },
    shadowRadius: 56,
    elevation: 3,
    borderRadius: 12,
    margin: 10,
    shadowOpacity: 1,
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: theme.colors.black,
    opacity: 0.6,
    margin: 12
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 12
  },
  heading: {
    fontFamily: theme.fonts.SFProBold,
    fontSize: 22,
    letterSpacing: 0.35,
    lineHeight: 28
  },
  text2: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 12,
    lineHeight: 22,
    color: "#979797",
    letterSpacing: -0.41,
    textAlign: "right",
    marginBottom: 3,
    marginRight: 8
  },
  upperBackground: {
    backgroundColor: "rgba(38, 191, 237, 0.35)",
    borderTopEndRadius: 12,
    borderTopStartRadius: 12
  }
});
