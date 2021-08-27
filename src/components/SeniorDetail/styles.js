import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerLocStatsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15
  },
  nameTextStyle: {
    fontFamily: theme.fonts.SFProRegular,
    alignSelf: "center",
    fontSize: 13, 
    letterSpacing: -0.08
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
  registeredSeniorItemStyle: {
    // height: 80,
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },
  registeredSeniorIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    resizeMode: "cover"
  },
  registeredSeniorUsername: {
    fontFamily: theme.fonts.SFProRegular,
    color: theme.colors.black_17,
    fontSize: 13,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center"
  }
});
