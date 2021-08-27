import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: theme.colors.bg_grey,
    borderRadius: 12,
    padding: 16,
  },
  name: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    flexGrow: 1,
  },
  detail: {
    color: "rgba(0,0,0, 0.48)",
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 13,
    flexGrow: 1,
    marginTop: 1,
  },
  image: {
    alignSelf: "center",
  },
});
