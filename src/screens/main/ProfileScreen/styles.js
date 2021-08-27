import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.grey_shade_3,
    marginVertical: 8
  },
  imageProfile: { height: "40%", width: "100%" },
  scrollView: { marginBottom: 80 },
  root: {
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "red",
    marginVertical: 12,
    marginHorizontal: 32
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  listItemContainer: {
    flexGrow: 1,
    flexDirection: "row",
    padding: 8
  },
  title: {
    padding: 8,
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 18
  },
  right: { padding: 8, flexDirection: "row" },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  tabItem: { flexDirection: 'row', width: 68, justifyContent: 'flex-end' },
  textStyle: {
    fontSize: 14,
    color: theme.colors.white,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  subContainer: {
    height: 36,
    flexDirection: 'row',
    borderRadius: 14,
    borderColor: '#fff',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRightColor: theme.colors.white,
  },
  root: {
    flexGrow: 1,
    flexDirection: "row",
    padding: 8
  },
  listTitle: {
    padding: 8,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 18
  },
  rightImage: { marginLeft: 8, alignSelf: "center" }
});
