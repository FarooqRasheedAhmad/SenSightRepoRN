import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  headerLocStatsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  headerLocStatsTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 21,
    flexGrow: 1
  },
  headerLocStatsSeeAll: {
    color: theme.colors.colorPrimary,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    textAlign: "center"
  },
  lastLocItemTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    flexGrow: 1
  },
  lastLocItemDetail: {
    color: "rgba(0,0,0, 0.48)",
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 13,
    flexGrow: 1,
    marginTop: 1
  },
  lastLocItemLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0, 0.20)",
    marginLeft: 100,
    marginTop: 12
  },
  btnContainer: {
    margin: 12,
  }
});
