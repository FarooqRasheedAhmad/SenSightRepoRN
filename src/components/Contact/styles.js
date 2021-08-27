import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5
  },
  text: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 15,
    paddingTop: 15
  },
  imageContainer: {
    height: 40,
    width: 40,
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: theme.colors.grey_shade_3
  }
});
