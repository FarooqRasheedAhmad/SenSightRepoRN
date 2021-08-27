import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  infoTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontFamily: theme.fonts.SFProBold,
    marginVertical: 16
  },
  infoStatsRoot: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center"
  },
  infoStatsIcon: {
    height: 13,
    width: 14,
    alignSelf: "center",
    marginHorizontal: 8
  },
  infoStatText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 14,
    color: theme.colors.grey_shade_1
  }
});
