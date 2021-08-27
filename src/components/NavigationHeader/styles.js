import { StyleSheet, StatusBar, Platform } from "react-native"
import { theme } from "../../theme"

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
    backgroundColor: theme.colors.colorPrimary
  },
  subcontainer: { width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeftTextStyle: {
    marginLeft: 5,
    color: theme.colors.white,
    fontSize: 17,
  },
  headerRightTextStyle: {
    marginRight: 5,
    color: theme.colors.white,
    fontSize: 17,
    alignSelf: 'flex-end'
  },
  maingHeadingStyle: {
    position: 'absolute',
    textAlign: "center",
    ...StyleSheet.absoluteFill,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    justifyContent: 'center',
    color: theme.colors.white,
    zIndex: 0
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 15,
    paddingTop: 15
  }
});
