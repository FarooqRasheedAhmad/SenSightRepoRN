import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    // borderWidth:1,
    backgroundColor: theme.colors.white,
    flex:1,
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 10,
      height: 10
    },
    shadowRadius: 56,
    elevation: 3,
    borderRadius: 12,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    shadowOpacity: 1,
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 16,
    letterSpacing: -0.24,
    color: theme.colors.black,
    opacity: 0.6,
    margin: 12,
    marginBottom: 0,
    marginTop: 5

  },
  row2: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    margin: 12,
    marginBottom: 5
  },
  heading: {
    fontFamily: theme.fonts.SFProBold,
    fontSize: 18,
    letterSpacing: 0.35,
    lineHeight: 20,
    marginHorizontal: 12,
    marginTop: 12,
  },
  text2: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 11,
    lineHeight: 12,
    color: "#979797",
    letterSpacing: -0.41,
    textAlign: "right",
    marginBottom: 3,
    marginRight: 8
  },
  upperBackground: {
    backgroundColor: "rgba(242, 153, 74, 0.3)",
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    flex:1,
  }
});
